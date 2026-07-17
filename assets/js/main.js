const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRSDNjSvjxfstsjznBpzU-Z0xkbQICuaDCYWgIAS1qKD7C7uVQAJaRrJTKcpyoDwreQgp_ffx-ogvc/pub?output=csv";
let stats = JSON.parse(localStorage.getItem('clicks')) || {};

Papa.parse(CSV_URL, {
    download: true, 
    header: true,
    complete: (results) => {
        const grid = document.getElementById('product-grid');
        // Sắp xếp sản phẩm theo lượt click (Best Seller lên đầu)
        const products = results.data.filter(p => p.title).sort((a,b) => (stats[b.id]||0) - (stats[a.id]||0));
        
        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product-card p-3';
            // Bố cục chuyển đổi cao: Ảnh lớn, Giá nổi bật, CTA mạnh
            div.innerHTML = `
                <img src="${p.image}" class="w-full h-48 object-cover rounded-lg mb-3">
                <h3 class="font-bold text-sm mb-1">${p.title}</h3>
                <p class="text-[#a63f3a] font-bold mb-3">${p.price || 'Liên hệ'}</p>
                <a href="${p.shopeeLink}" onclick="track('${p.id}')" target="_blank" class="btn-buy">MUA NGAY</a>
            `;
            grid.appendChild(div);
        });
    }
});

function track(id) {
    stats[id] = (stats[id] || 0) + 1;
    localStorage.setItem('clicks', JSON.stringify(stats));
}

document.getElementById('admin-trigger').onclick = () => {
    document.getElementById('admin-panel').classList.toggle('hidden');
    document.getElementById('stats-list').innerHTML = Object.entries(stats)
        .map(([id, val]) => `<p class="border-b py-1">ID ${id}: <b>${val}</b> lần nhấn</p>`).join('');
};