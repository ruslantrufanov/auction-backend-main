let currentAuction = null;
let timerInterval = null;
let botUsers = [];

/* ================= API ================= */

async function apiGet(path) {
    const res = await fetch(path);
    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
}

/* ================= USERS ================= */

document.getElementById('createUser').onclick = async () => {
    const balance = Number(document.getElementById('newUserBalance').value);
    const user = await apiPost('/api/users', { balance });
    document.getElementById('createdUser').innerText = `User created! ID: ${user._id}`;
    await loadUsersForBots();
};

async function loadUsersForBots() {
    const users = await apiGet('/api/users');
    botUsers = users.map(u => u._id);
}

/* ================= AUCTION ================= */

document.getElementById('createAuction').onclick = async () => {
    const itemName = document.getElementById('itemName').value;
    const totalItems = Number(document.getElementById('totalItems').value);

    const auction = await apiPost('/api/auctions', { itemName, totalItems });

    currentAuction = auction;
    currentAuction.roundIndex = 1;

    document.getElementById('auctionId').value = auction._id;
    document.getElementById('currentItem').innerText = auction.itemName;
    document.getElementById('remainingItems').innerText = auction.remainingItems;

    startTimer();
    alert('Auction created!');
};

/* ================= BIDS ================= */

document.getElementById('placeBid').onclick = async () => {
    if (!currentAuction) return alert('Create auction first');
    if (currentAuction.remainingItems <= 0) return alert('Auction finished');

    const userId = document.getElementById('userId').value;
    const amount = Number(document.getElementById('amount').value);

    await apiPost('/api/bids', {
        userId,
        auctionId: currentAuction._id,
        amount,
        round: currentAuction.roundIndex
    });

    refreshBids();
};

/* ================= LIVE BIDS ================= */

async function refreshBids() {
    if (!currentAuction) return;

    const bids = await apiGet('/api/bids');
    const filtered = bids.filter(
        b =>
            b.auctionId === currentAuction._id &&
            b.round === currentAuction.roundIndex
    );

    const tbody = document.getElementById('liveBids');
    tbody.innerHTML = '';

    const maxAmount = Math.max(0, ...filtered.map(b => b.amount));

    filtered.forEach(b => {
        const tr = document.createElement('tr');

        let className = '';
        if (b.status === 'WINNER') className = 'winner';
        else if (b.amount === maxAmount) className = 'leader';

        tr.className = className;

        tr.innerHTML = `
            <td>${b.userId}</td>
            <td>${b.amount}</td>
            <td>${b.round}</td>
            <td>${b.status}</td>
        `;

        tbody.appendChild(tr);
    });
}

/* ================= TIMER / ROUNDS ================= */

function startTimer() {
    let timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(async () => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            await endRound();
        }
    }, 1000);
}

async function endRound() {
    const bids = await apiGet('/api/bids');

    const roundBids = bids.filter(
        b =>
            b.auctionId === currentAuction._id &&
            b.status === 'ACTIVE' &&
            b.round === currentAuction.roundIndex
    );

    const userSums = {};
    roundBids.forEach(b => {
        userSums[b.userId] = (userSums[b.userId] || 0) + b.amount;
    });

    const sortedUsers = Object.entries(userSums).sort((a, b) => b[1] - a[1]);

    const winnersCount = Math.min(
        currentAuction.remainingItems,
        sortedUsers.length
    );

    const winners = sortedUsers.slice(0, winnersCount);

    for (const [userId] of winners) {
        for (const bid of roundBids.filter(b => b.userId === userId)) {
            await apiPost('/api/bids', {
                ...bid,
                status: 'WINNER'
            });
        }
    }

    currentAuction.remainingItems -= winnersCount;
    document.getElementById('remainingItems').innerText =
        currentAuction.remainingItems;

    alert(
        `Round ${currentAuction.roundIndex} ended. Winners: ${winners
            .map(w => w[0])
            .join(', ')}`
    );

    refreshBids();

    if (currentAuction.remainingItems <= 0) {
        alert('Auction finished!');
        currentAuction = null;
        return;
    }

    currentAuction.roundIndex++;
    startTimer();
}

/* ================= BOTS ================= */

function startBots() {
    setInterval(async () => {
        if (!currentAuction) return;
        if (botUsers.length === 0) return;
        if (currentAuction.remainingItems <= 0) return;

        const randomUser =
            botUsers[Math.floor(Math.random() * botUsers.length)];
        const randomAmount = Math.floor(Math.random() * 200) + 50;

        await apiPost('/api/bids', {
            userId: randomUser,
            auctionId: currentAuction._id,
            amount: randomAmount,
            round: currentAuction.roundIndex
        });

        refreshBids();
    }, 2000);
}

/* ================= INIT ================= */

loadUsersForBots();
startBots();
setInterval(refreshBids, 2000);
