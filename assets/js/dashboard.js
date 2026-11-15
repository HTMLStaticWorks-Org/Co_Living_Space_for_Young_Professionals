/**
 * NESTLY CO-LIVING — RESIDENT & ADMIN DASHBOARD CONTROLLER (dashboard.js)
 * Powers interactive localStorage flows: Pay Rent, Maintenance Tickets,
 * Amenity Slot Booking, Community Board RSVP, House Manager Chat, Admin Queue.
 */
(function () {
  'use strict';

  function toast(msg) {
    if (window.NestlyToast) {
      window.NestlyToast(msg);
    }
  }

  /* ------------------------------------------------------------------------
     1. SIDEBAR MOBILE DRAWER TOGGLE
     ------------------------------------------------------------------------ */
  function initDashboardSidebar() {
    const toggleBtn = document.querySelector('[data-sidebar-toggle]');
    const closeBtn = document.querySelector('[data-sidebar-close]');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (!sidebar) return;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
      });
    }
  }

  /* ------------------------------------------------------------------------
     2. PAY RENT FLOW (pay-rent.html & dashboard.html)
     ------------------------------------------------------------------------ */
  function initPayRentFlow() {
    const RENT_KEY = 'nestly_rent_paid_nov2026';
    const statusBadge = document.getElementById('rentStatusBadge');
    const dueAmountEl = document.getElementById('rentDueAmount');
    const payNowBtn = document.getElementById('payRentNowBtn');
    const historyBody = document.getElementById('paymentHistoryBody');

    function syncRentUI() {
      const isPaid = localStorage.getItem(RENT_KEY) === 'true';
      if (isPaid) {
        if (statusBadge) {
          statusBadge.className = 'status-chip status-paid';
          statusBadge.textContent = 'Paid • Nov 2026';
        }
        if (dueAmountEl) dueAmountEl.textContent = '₹0';
        if (payNowBtn) {
          payNowBtn.textContent = 'November Rent Paid ✓';
          payNowBtn.disabled = true;
        }
      }
    }

    if (payNowBtn) {
      payNowBtn.addEventListener('click', () => {
        localStorage.setItem(RENT_KEY, 'true');
        syncRentUI();
        if (historyBody && !document.getElementById('novReceiptRow')) {
          const row = document.createElement('tr');
          row.id = 'novReceiptRow';
          row.innerHTML =
            '<td data-label="Invoice ID" class="font-mono">#INV-2026-1109</td>' +
            '<td data-label="Billing Cycle">November 2026</td>' +
            '<td data-label="Amount" class="font-mono">₹24,500</td>' +
            '<td data-label="Method">UPI Instant</td>' +
            '<td data-label="Status"><span class="status-chip status-paid">Paid</span></td>' +
            '<td data-label="Receipt"><button type="button" class="btn btn-ghost" data-download-receipt="INV-2026-1109" style="height:38px;padding-inline:16px;font-size:0.82rem;">Download PDF</button></td>';
          historyBody.prepend(row);
        }
        toast('Payment of ₹24,500 confirmed! Receipt #INV-2026-1109 generated.');
      });
    }

    document.addEventListener('click', (e) => {
      const dlBtn = e.target.closest('[data-download-receipt]');
      if (!dlBtn) return;
      const invId = dlBtn.getAttribute('data-download-receipt');
      const content =
        'NESTLY CO-LIVING — OFFICIAL RENT RECEIPT\n' +
        '----------------------------------------\n' +
        'Invoice ID: ' + invId + '\n' +
        'Resident: Riya Sharma (Suite 304, Indiranagar House)\n' +
        'Amount Paid: INR 24,500 (All-Inclusive)\n' +
        'Status: PAID IN FULL\n' +
        'Thank you for living well at Nestly!';
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = invId + '-Receipt.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast('Downloaded receipt ' + invId);
    });

    syncRentUI();
  }

  /* ------------------------------------------------------------------------
     3. MAINTENANCE TICKET FLOW (maintenance.html & admin/maintenance-queue.html)
     ------------------------------------------------------------------------ */
  function initMaintenanceFlow() {
    const form = document.getElementById('maintenanceRequestForm');
    const listBody = document.getElementById('maintenanceTableBody');

    if (form && listBody) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = document.getElementById('maintCategory').value;
        const area = document.getElementById('maintArea').value;
        const prio = document.getElementById('maintPriority').value;
        const desc = document.getElementById('maintDesc').value.trim();

        if (!desc) {
          toast('Please describe the issue briefly.');
          return;
        }

        const ticketId = '#MNT-' + Math.floor(1000 + Math.random() * 9000);
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td data-label="Ticket ID" class="font-mono">' + ticketId + '</td>' +
          '<td data-label="Category">' + cat + ' (' + area + ')</td>' +
          '<td data-label="Issue">' + desc + '</td>' +
          '<td data-label="Priority"><span class="status-chip status-open">' + prio + '</span></td>' +
          '<td data-label="Status"><span class="status-chip status-open">Open</span></td>' +
          '<td data-label="Updated">Just now</td>';
        listBody.prepend(tr);
        form.reset();
        toast('Maintenance ticket ' + ticketId + ' raised! Technician notified.');
      });
    }

    // Admin status update action
    document.addEventListener('click', (e) => {
      const resolveBtn = e.target.closest('[data-resolve-ticket]');
      if (!resolveBtn) return;
      const row = resolveBtn.closest('tr');
      if (row) {
        const statusCell = row.querySelector('[data-ticket-status]');
        if (statusCell) {
          statusCell.className = 'status-chip status-resolved';
          statusCell.textContent = 'Resolved';
        }
      }
      resolveBtn.textContent = 'Resolved ✓';
      resolveBtn.disabled = true;
      toast('Ticket marked as Resolved and resident notified.');
    });
  }

  /* ------------------------------------------------------------------------
     4. AMENITY SLOT BOOKING FLOW (amenity-booking.html)
     ------------------------------------------------------------------------ */
  function initAmenityBookingFlow() {
    const slotBtns = document.querySelectorAll('.slot-btn');
    const bookForm = document.getElementById('amenityBookingForm');
    const myBookingsBody = document.getElementById('myAmenityBookingsBody');
    let selectedSlot = '07:00 AM – 08:00 AM';

    slotBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        slotBtns.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedSlot = btn.textContent.trim();
      });
    });

    if (bookForm && myBookingsBody) {
      bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const space = document.getElementById('amenitySpaceSelect').value;
        const date = document.getElementById('amenityDateInput').value || 'Tomorrow';
        const row = document.createElement('tr');
        row.innerHTML =
          '<td data-label="Amenity"><strong>' + space + '</strong></td>' +
          '<td data-label="Date">' + date + '</td>' +
          '<td data-label="Time Slot" class="font-mono">' + selectedSlot + '</td>' +
          '<td data-label="Status"><span class="status-chip status-resolved">Confirmed</span></td>' +
          '<td data-label="Action"><button type="button" class="btn btn-ghost" data-cancel-booking style="height:36px;padding-inline:14px;font-size:0.8rem;">Cancel</button></td>';
        myBookingsBody.prepend(row);
        toast('Reserved ' + space + ' for ' + selectedSlot + '!');
      });
    }

    document.addEventListener('click', (e) => {
      const cancelBtn = e.target.closest('[data-cancel-booking]');
      if (!cancelBtn) return;
      const row = cancelBtn.closest('tr');
      if (row) row.remove();
      toast('Amenity booking cancelled.');
    });
  }

  /* ------------------------------------------------------------------------
     5. HOUSE MANAGER CHAT (messages.html) & COMMUNITY NOTICE
     ------------------------------------------------------------------------ */
  function initMessagesAndBoard() {
    const chatForm = document.getElementById('houseManagerChatForm');
    const chatFeed = document.getElementById('chatMessagesFeed');
    const chatInput = document.getElementById('chatMessageInput');

    if (chatForm && chatFeed && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const outBubble = document.createElement('div');
        outBubble.className = 'chat-bubble outgoing';
        outBubble.innerHTML = '<p>' + text + '</p><small style="opacity:0.75;font-size:0.72rem;">Just now</small>';
        chatFeed.appendChild(outBubble);
        chatFeed.scrollTop = chatFeed.scrollHeight;
        chatInput.value = '';

        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'chat-bubble incoming';
          reply.innerHTML = '<strong>Karthik (House Captain)</strong><p>Got it, Riya! I have logged this for Suite 304 and will update you within 15 minutes.</p><small style="opacity:0.7;font-size:0.72rem;">Just now</small>';
          chatFeed.appendChild(reply);
          chatFeed.scrollTop = chatFeed.scrollHeight;
        }, 900);
      });
    }

    const noticeForm = document.getElementById('postNoticeForm');
    const noticeGrid = document.getElementById('communityNoticeGrid');
    if (noticeForm && noticeGrid) {
      noticeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('noticeTitle').value.trim();
        const body = document.getElementById('noticeBody').value.trim();
        if (!title || !body) return;
        const card = document.createElement('article');
        card.className = 'tilt-card';
        card.innerHTML =
          '<span class="card-tag">Resident Note</span>' +
          '<h3>' + title + '</h3>' +
          '<p>' + body + '</p>' +
          '<div class="card-subtext">Posted by Riya S. (Suite 304) • Just now</div>';
        noticeGrid.prepend(card);
        noticeForm.reset();
        toast('Posted to your House Community Board!');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDashboardSidebar();
    initPayRentFlow();
    initMaintenanceFlow();
    initAmenityBookingFlow();
    initMessagesAndBoard();
  });
})();
