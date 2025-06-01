// Fungsi memuat header & footer
  function loadComponent(id, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;

        if (id === 'header') {
          highlightActiveNavLink();
        }
      });
  }

  // Highlight menu aktif di navbar
  function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // Fungsi load RSS berita
  function loadRSSNews() {
    const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.marinelink.com/news/rss';

    fetch(rssUrl)
      .then(response => response.json())
      .then(data => {
        const newsContainer = document.getElementById('rss-news');
        if (!newsContainer) return;

        if (!data.items || data.items.length === 0) {
          newsContainer.innerHTML = '<p style="color:white;">Tidak ada berita tersedia.</p>';
          return;
        }

        data.items.slice(0, 3).forEach(item => {
          const card = document.createElement('div');
          card.className = 'news-card';
          card.innerHTML = `
            <a href="${item.link}" target="_blank" style="color: black; text-decoration: none;">
              <strong>${item.title}</strong>
            </a><br>
            ${item.description.slice(0, 100)}...<br>
            <em>${new Date(item.pubDate).toLocaleString()}</em>
          `;
          newsContainer.appendChild(card);
        });
      })
      .catch(error => {
        const newsContainer = document.getElementById('rss-news');
        if (newsContainer) {
          newsContainer.innerHTML = '<p style="color:white;">Gagal memuat berita.</p>';
        }
        console.error('RSS Fetch error:', error);
      });
  }

  // Fungsi pencarian produk
  function filterProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".product-card");
    const message = document.getElementById("noResultsMessage");

    let hasMatch = false;
    products.forEach(product => {
      const name = product.getAttribute("data-name");
      if (name.includes(input)) {
        product.style.display = "block";
        hasMatch = true;
      } else {
        product.style.display = "none";
      }
    });

    message.style.display = hasMatch ? "none" : "block";
  }

  function resetSearch() {
    document.getElementById("searchInput").value = "";
    const products = document.querySelectorAll(".product-card");
    products.forEach(product => product.style.display = "block");
    document.getElementById("noResultsMessage").style.display = "none";
  }

  // Jalankan saat halaman siap
  window.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
    loadRSSNews();
  });
// Deteksi Enter di input search
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        filterProducts();
      }
    });
  }