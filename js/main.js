/**
 * MAIN.JS - BRIAN LUU FURNITURE
 * Dark Mode, Sidebar, Slider, Search, Cart, Wishlist
 */

document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  initSidebar();
  initHeroSlider();
  setActiveNav();
  initWishlist();
  initSearch();
  initCart();
  initQuantityControls();
  loadCartCount();
  initMiniSlider();
  initPosterSliders();
});

// ===== DARK / LIGHT MODE =====
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
      }
    });
  }
}

// ===== SIDEBAR (3 GẠCH) =====
function initSidebar() {
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.getElementById("sidebarMenu");
  const overlay = document.getElementById("sidebarOverlay");
  const closeBtn = document.getElementById("sidebarClose");

  if (!menuBtn || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
}

// ===== HERO SLIDER =====
function initHeroSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");

  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  setInterval(nextSlide, 3000);

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  if (dots.length) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });
  }

  showSlide(0);
}

// ===== ACTIVE NAVIGATION =====
function setActiveNav() {
  const navItems = document.querySelectorAll(".nav-item");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === currentPath) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// ===== WISHLIST BUTTON =====
// ===== WISHLIST BUTTON =====
function initWishlist() {
  const wishlistBtns = document.querySelectorAll(".wishlist-btn");

  // Cập nhật số lượng yêu thích
  updateWishlistCount();

  wishlistBtns.forEach((btn) => {
    const productId = getProductIdFromCard(btn);

    // Load trạng thái wishlist từ localStorage
    if (localStorage.getItem(`wishlist_${productId}`) === "true") {
      btn.classList.add("active");
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.style.fontVariationSettings = "'FILL' 1";
        btn.style.background = "#064e3b";
        btn.style.color = "white";
      }
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const icon = this.querySelector(".material-symbols-outlined");
      const productId = getProductIdFromCard(this);

      // Hiệu ứng nhấp nháy
      this.classList.add("wishlist-pulse");
      setTimeout(() => {
        this.classList.remove("wishlist-pulse");
      }, 500);

      if (this.classList.contains("active")) {
        // Bỏ yêu thích
        this.classList.remove("active");
        if (icon) {
          icon.style.fontVariationSettings = "'FILL' 0";
        }
        this.style.background = "rgba(255,255,255,0.8)";
        this.style.color = "#1A1C1E";
        localStorage.setItem(`wishlist_${productId}`, "false");
        showToast("🗑️ Đã xóa khỏi danh sách yêu thích");
      } else {
        // Thêm yêu thích
        this.classList.add("active");
        if (icon) {
          icon.style.fontVariationSettings = "'FILL' 1";
        }
        this.style.background = "#064e3b";
        this.style.color = "white";
        localStorage.setItem(`wishlist_${productId}`, "true");
        showToast("❤️ Đã thêm vào danh sách yêu thích");
      }

      // Cập nhật số lượng yêu thích
      updateWishlistCount();
    });
  });
}

// Hàm cập nhật số lượng yêu thích
function updateWishlistCount() {
  // Đếm số sản phẩm yêu thích
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      key.startsWith("wishlist_") &&
      localStorage.getItem(key) === "true"
    ) {
      count++;
    }
  }

  // Cập nhật số ở bottom nav
  const bottomNav = document.querySelector(".bottom-nav");
  if (bottomNav) {
    // Tìm nút trái tim trong bottom nav
    const navIcons = bottomNav.querySelectorAll(".nav-icon");
    let heartBtn = null;

    // Duyệt tìm nút có icon favorite
    navIcons.forEach((btn) => {
      const icon = btn.querySelector(".material-symbols-outlined");
      if (
        icon &&
        (icon.textContent === "favorite" ||
          icon.textContent === "favorite_border")
      ) {
        heartBtn = btn;
      }
    });

    if (heartBtn) {
      // Xóa số cũ
      const oldCount = heartBtn.querySelector(".wishlist-count");
      if (oldCount) oldCount.remove();

      // Thêm số mới
      if (count > 0) {
        const countSpan = document.createElement("span");
        countSpan.className = "wishlist-count";
        countSpan.textContent = count > 9 ? "9+" : count;
        heartBtn.style.position = "relative";
        heartBtn.appendChild(countSpan);
      }
    }
  }

  // Cập nhật số trên các card sản phẩm (nếu có)
  document.querySelectorAll(".product-card").forEach((card) => {
    const btn = card.querySelector(".wishlist-btn");
    if (btn) {
      const productId = getProductIdFromCard(btn);
      const isFavorite =
        localStorage.getItem(`wishlist_${productId}`) === "true";

      // Xóa số cũ trên card
      const oldCardCount = card.querySelector(".wishlist-count");
      if (oldCardCount) oldCardCount.remove();

      // Không thêm số trên card sản phẩm (chỉ hiển thị ở bottom nav)
    }
  });
}

function getProductIdFromCard(element) {
  const card = element.closest(".product-card");
  if (card) {
    // Tìm link sản phẩm
    const link = card.querySelector('a[href*="san-pham.html?id="]');
    if (link) {
      const href = link.getAttribute("href");
      // Lấy ID từ URL (dạng san-pham.html?id=ghe-nhung)
      const match = href.match(/id=([^&]+)/);
      if (match) {
        return match[1]; // Trả về ID thật: "ghe-nhung"
      }
    }

    // Fallback: thử tìm link cũ (nếu có)
    const oldLink = card.querySelector('a[href*="san-pham-"]');
    if (oldLink) {
      const href = oldLink.getAttribute("href");
      return href.replace(".html", "").replace("san-pham-", "");
    }
  }

  // Nếu không tìm thấy, trả về ID mặc định
  console.warn("Không tìm thấy ID sản phẩm, dùng ID ngẫu nhiên");
  return "product_" + Math.random().toString(36).substr(2, 9);
}

// ===== TOAST NOTIFICATION (NÂNG CẤP) =====
function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10001;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // Icon theo loại thông báo
  let icon = "check_circle";
  if (type === "error") icon = "error";
  if (type === "warning") icon = "warning";
  if (type === "info") icon = "info";

  toast.style.cssText = `
    background: linear-gradient(135deg, #064e3b 0%, #0a6e4f 100%);
    color: white;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 500;
    box-shadow: 0 15px 35px rgba(6,78,59,0.4);
    animation: slideInUp 0.4s ease, fadeOut 0.4s ease 2.6s;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 90%;
    text-align: center;
    border-left: 5px solid #86efac;
  `;

  toast.innerHTML = `
    <span class="material-icons-round" style="font-size: 22px; color: #86efac; animation: checkPop 0.3s ease;">${icon}</span> 
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Animation keyframes (nếu chưa có)
  if (!document.querySelector("#toast-keyframes")) {
    const style = document.createElement("style");
    style.id = "toast-keyframes";
    style.textContent = `
      @keyframes slideInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
      @keyframes checkPop {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      @keyframes cartBounce {
        0% { transform: scale(1); }
        30% { transform: scale(1.3); }
        50% { transform: scale(0.9); }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.remove();
    if (toastContainer.children.length === 0) toastContainer.remove();
  }, 3000);
}

// ===== SEARCH FUNCTION =====
function initSearch() {
  const searchBtn = document.querySelector(".search-btn");
  if (!searchBtn) return;

  let searchModal = document.querySelector(".search-modal");
  if (!searchModal) {
    searchModal = document.createElement("div");
    searchModal.className = "search-modal";
    searchModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(10px);
      z-index: 20000;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      align-items: flex-start;
      justify-content: center;
      padding-top: 120px;
    `;
    searchModal.innerHTML = `
      <div style="width: 90%; max-width: 600px; background: var(--bg-light); border-radius: 20px; padding: 30px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <button class="search-close" style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(0,0,0,0.05); cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <span class="material-icons-round">close</span>
        </button>
        <h3 style="font-family: var(--font-serif); font-size: 24px; margin-bottom: 20px;">Tìm kiếm sản phẩm</h3>
        <div style="position: relative; margin-bottom: 20px;">
          <input type="text" id="searchInput" placeholder="Nhập tên sản phẩm, danh mục..." style="width: 100%; padding: 16px 50px 16px 20px; border-radius: 50px; border: 2px solid rgba(6,78,59,0.2); font-size: 16px; background: transparent; outline: none;">
          <button id="searchSubmit" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
            <span class="material-icons-round" style="color: var(--primary-light);">search</span>
          </button>
        </div>
        <div id="searchResults" style="max-height: 400px; overflow-y: auto; display: none;">
          <p style="font-weight: 600; margin-bottom: 16px;">Kết quả tìm kiếm:</p>
          <div id="searchResultsList" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
        <div id="searchSuggestions">
          <p style="font-weight: 600; margin-bottom: 12px;">Gợi ý:</p>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <span style="background: rgba(6,78,59,0.1); padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer;">Sofa</span>
            <span style="background: rgba(6,78,59,0.1); padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer;">Bàn</span>
            <span style="background: rgba(6,78,59,0.1); padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer;">Ghế</span>
            <span style="background: rgba(6,78,59,0.1); padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer;">Đèn</span>
            <span style="background: rgba(6,78,59,0.1); padding: 8px 16px; border-radius: 30px; font-size: 14px; cursor: pointer;">Tủ</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(searchModal);

    const updateSearchModalTheme = () => {
      const modalContent = searchModal.querySelector("div");
      if (document.body.classList.contains("dark-mode")) {
        modalContent.style.background = "var(--bg-dark)";
        modalContent.style.color = "var(--text-dark)";
      } else {
        modalContent.style.background = "var(--bg-light)";
        modalContent.style.color = "var(--text-light)";
      }
    };

    updateSearchModalTheme();

    const observer = new MutationObserver(updateSearchModalTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchModal.style.display = "flex";
    setTimeout(() => (searchModal.style.opacity = "1"), 10);
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("searchInput")?.focus(), 100);
  });

  const closeBtn = searchModal.querySelector(".search-close");
  const closeSearchModal = () => {
    searchModal.style.opacity = "0";
    setTimeout(() => {
      searchModal.style.display = "none";
      document.body.style.overflow = "";
    }, 300);
  };

  closeBtn.addEventListener("click", closeSearchModal);
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) closeSearchModal();
  });

  const searchInput = document.getElementById("searchInput");
  const searchSubmit = document.getElementById("searchSubmit");
  const searchResults = document.getElementById("searchResults");
  const searchResultsList = document.getElementById("searchResultsList");
  const searchSuggestions = document.getElementById("searchSuggestions");

  // Product database for search (ĐẦY ĐỦ 32+ SẢN PHẨM)
  const productDatabase = [
    // ===== PHÒNG KHÁCH (8 sản phẩm) =====
    {
      name: "Ghế sofa êm",
      category: "Phòng khách",
      price: "26.899.000 ₫",
      link: "san-pham.html?id=sofa-em",
      image: "cloud-sofa.jpg",
    },
    {
      name: "Ghế nhung",
      category: "Phòng khách",
      price: "12.300.000 ₫",
      link: "san-pham.html?id=ghe-nhung",
      image: "velvet-armchair.jpg",
    },
    {
      name: "Bàn cẩm thạch",
      category: "Phòng khách",
      price: "19.750.000 ₫",
      link: "san-pham.html?id=ban-cam-thach",
      image: "marble-table.jpg",
    },
    {
      name: "Đèn nghệ thuật",
      category: "Phòng khách",
      price: "13.500.000 ₫",
      link: "san-pham.html?id=den-nghe-thuat",
      image: "sculptural-lamp.jpg",
    },
    {
      name: "Sofa ba chỗ",
      category: "Phòng khách",
      price: "44.900.000 ₫",
      link: "san-pham.html?id=sofa-3-cho",
      image: "living-room-2.jpg",
    },
    {
      name: "Ghế đơn",
      category: "Phòng khách",
      price: "7.575.000 ₫",
      link: "san-pham.html?id=ghe-don",
      image: "living-room-3.jpg",
    },
    {
      name: "Bàn trà",
      category: "Phòng khách",
      price: "12.000.000 ₫",
      link: "san-pham.html?id=ban-tra",
      image: "living-room-4.jpg",
    },
    {
      name: "Kệ tivi",
      category: "Phòng khách",
      price: "16.300.000 ₫",
      link: "san-pham.html?id=ke-tivi",
      image: "living-room-5.jpg",
    },

    // ===== PHÒNG NGỦ (6 sản phẩm) =====
    {
      name: "Giường ngủ",
      category: "Phòng ngủ",
      price: "52.900.000 ₫",
      link: "san-pham.html?id=giuong-ngu",
      image: "bedroom-2.jpg",
    },
    {
      name: "Tủ đầu giường",
      category: "Phòng ngủ",
      price: "7.200.000 ₫",
      link: "san-pham.html?id=tu-dau-giuong",
      image: "bedroom-3.jpg",
    },
    {
      name: "Tủ quần áo",
      category: "Phòng ngủ",
      price: "21.350.000 ₫",
      link: "san-pham.html?id=tu-quan-ao",
      image: "bedroom-4.jpg",
    },
    {
      name: "Bàn trang điểm",
      category: "Phòng ngủ",
      price: "18.700.000 ₫",
      link: "san-pham.html?id=ban-trang-diem",
      image: "bedroom-5.jpg",
    },
    {
      name: "Ghế thư giãn",
      category: "Phòng ngủ",
      price: "23.200.000 ₫",
      link: "san-pham.html?id=ghe-thu-gian",
      image: "bedroom-6.jpg",
    },
    {
      name: "Đèn ngủ",
      category: "Phòng ngủ",
      price: "8.900.000 ₫",
      link: "san-pham.html?id=den-ngu",
      image: "lighting-7.jpg",
    },

    // ===== PHÒNG ĂN (6 sản phẩm) =====
    {
      name: "Bàn ăn đá cẩm thạch",
      category: "Phòng ăn",
      price: "26.600.000 ₫",
      link: "san-pham.html?id=ban-an-cam-thach",
      image: "dining-10.jpg",
    },
    {
      name: "Ghế ăn",
      category: "Phòng ăn",
      price: "3.100.000 ₫",
      link: "san-pham.html?id=ghe-an",
      image: "dining-8.jpg",
    },
    {
      name: "Tủ đựng bếp",
      category: "Phòng ăn",
      price: "12.500.000 ₫",
      link: "san-pham.html?id=tu-dung-bep",
      image: "dining-3.jpg",
    },
    {
      name: "Ghế cao",
      category: "Phòng ăn",
      price: "2.900.000 ₫",
      link: "san-pham.html?id=ghe-cao",
      image: "dining-4.jpg",
    },
    {
      name: "Đèn chùm",
      category: "Phòng ăn",
      price: "11.750.000 ₫",
      link: "san-pham.html?id=den-chum",
      image: "lighting-1.jpg",
    },
    {
      name: "Bếp đảo",
      category: "Phòng ăn",
      price: "23.980.000 ₫",
      link: "san-pham.html?id=bep-dao",
      image: "dining-6.jpg",
    },

    // ===== ĐÈN (6 sản phẩm) =====
    {
      name: "Đèn hồ quang",
      category: "Đèn",
      price: "9.250.000 ₫",
      link: "san-pham.html?id=den-ho-quang",
      image: "lighting-2.jpg",
    },
    {
      name: "Đèn treo",
      category: "Đèn",
      price: "11.700.000 ₫",
      link: "san-pham.html?id=den-treo",
      image: "lighting-3.jpg",
    },
    {
      name: "Đèn cầu thang",
      category: "Đèn",
      price: "13.250.000 ₫",
      link: "san-pham.html?id=den-cau-thang",
      image: "lighting-4.jpg",
    },
    {
      name: "Đèn để bàn",
      category: "Đèn",
      price: "5.900.000 ₫",
      link: "san-pham.html?id=den-de-ban",
      image: "lighting-5.jpg",
    },
    {
      name: "Đèn treo tường",
      category: "Đèn",
      price: "8.900.000 ₫",
      link: "san-pham.html?id=den-treo-tuong",
      image: "lighting-6.jpg",
    },
    {
      name: "Đèn chùm cao cấp",
      category: "Đèn",
      price: "39.000.000 ₫",
      link: "san-pham.html?id=den-chum-cao-cap",
      image: "lighting-8.jpg",
    },

    // ===== VĂN PHÒNG (6 sản phẩm) =====
    {
      name: "Bàn gỗ",
      category: "Văn phòng",
      price: "17.500.000 ₫",
      link: "san-pham.html?id=ban-go",
      image: "office-2.jpg",
    },
    {
      name: "Ghế da",
      category: "Văn phòng",
      price: "12.900.000 ₫",
      link: "san-pham.html?id=ghe-da",
      image: "office-3.jpg",
    },
    {
      name: "Kệ đựng",
      category: "Văn phòng",
      price: "10.550.000 ₫",
      link: "san-pham.html?id=ke-dung",
      image: "office-4.jpg",
    },
    {
      name: "Tủ tài liệu",
      category: "Văn phòng",
      price: "19.700.000 ₫",
      link: "san-pham.html?id=tu-tai-lieu",
      image: "office-5.jpg",
    },
    {
      name: "Ghế đệm cao cấp",
      category: "Văn phòng",
      price: "31.450.000 ₫",
      link: "san-pham.html?id=ghe-dem-cao-cap",
      image: "office-6.jpg",
    },
    {
      name: "Bàn dài",
      category: "Văn phòng",
      price: "28.300.000 ₫",
      link: "san-pham.html?id=ban-dai",
      image: "office-7.jpg",
    },
  ];

  function performSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
      searchResults.style.display = "none";
      searchSuggestions.style.display = "block";
      return;
    }

    const results = productDatabase.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );

    if (results.length > 0) {
      searchResultsList.innerHTML = results
        .map(
          (p) => `
            <a href="${p.link}" style="display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; background: rgba(6,78,59,0.05); text-decoration: none; color: inherit;">
              <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden;">
                <img src="images/${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 600;">${p.name}</div>
                <div style="font-size: 12px; opacity: 0.6;">${p.category}</div>
              </div>
              <div style="font-weight: 700; color: var(--primary-light);">${p.price}</div>
            </a>
          `,
        )
        .join("");
      searchResults.style.display = "block";
      searchSuggestions.style.display = "none";
    } else {
      searchResultsList.innerHTML = `<div style="text-align: center; padding: 40px;">Không tìm thấy "${query}"</div>`;
      searchResults.style.display = "block";
      searchSuggestions.style.display = "none";
    }
  }

  searchInput.addEventListener("input", (e) => performSearch(e.target.value));
  searchSubmit.addEventListener("click", () =>
    performSearch(searchInput.value),
  );
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch(searchInput.value);
  });

  searchSuggestions.querySelectorAll("span").forEach((tag) => {
    tag.addEventListener("click", () => {
      searchInput.value = tag.textContent;
      performSearch(tag.textContent);
    });
  });
}

// ===== CART FUNCTION =====
window.cart = [];
let cart = window.cart;

function initCart() {
  const savedCart = localStorage.getItem("brianLuuCart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartCount();
  initCartModal();
}

function initCartModal() {
  const cartBtn = document.querySelector(".cart-btn");
  if (!cartBtn) return;

  let cartModal = document.querySelector(".cart-modal");
  if (!cartModal) {
    cartModal = document.createElement("div");
    cartModal.className = "cart-modal";
    cartModal.style.cssText = `
      position: fixed;
      top: 0;
      right: -450px;
      width: 400px;
      max-width: 90%;
      height: 100vh;
      background: var(--bg-light);
      z-index: 20001;
      transition: right 0.4s ease;
      box-shadow: -10px 0 30px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    `;

    if (document.body.classList.contains("dark-mode")) {
      cartModal.style.background = "var(--bg-dark)";
      cartModal.style.color = "var(--text-dark)";
    }

    cartModal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <h3 style="font-family: var(--font-serif); font-size: 24px; margin: 0;">Giỏ hàng</h3>
        <button class="cart-close" style="width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(0,0,0,0.05); cursor: pointer;">
          <span class="material-icons-round">close</span>
        </button>
      </div>
      <div id="cartItems" style="flex: 1; overflow-y: auto; padding: 24px;"></div>
      <div style="padding: 24px; border-top: 1px solid rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 18px;">
          <span>Tổng cộng:</span>
          <span id="cartTotal" style="font-weight: 700; color: var(--primary-light);">0 ₫</span>
        </div>
        <button id="checkoutBtn" style="width: 100%; background: var(--primary-light); color: white; border: none; padding: 16px; border-radius: 40px; font-weight: 700; cursor: pointer;">
          <span class="material-icons-round">shopping_bag</span> THANH TOÁN
        </button>
      </div>
    `;
    document.body.appendChild(cartModal);

    let cartOverlay = document.querySelector(".cart-overlay");
    if (!cartOverlay) {
      cartOverlay = document.createElement("div");
      cartOverlay.className = "cart-overlay";
      cartOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(3px);
        z-index: 20000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(cartOverlay);
    }

    const openCart = () => {
      cartModal.style.right = "0";
      cartOverlay.style.opacity = "1";
      cartOverlay.style.visibility = "visible";
      document.body.style.overflow = "hidden";
      renderCartItems();
    };

    const closeCart = () => {
      cartModal.style.right = "-450px";
      cartOverlay.style.opacity = "0";
      cartOverlay.style.visibility = "hidden";
      document.body.style.overflow = "";
    };

    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });

    cartModal.querySelector(".cart-close").addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    document.getElementById("checkoutBtn").addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Giỏ hàng trống");
        return;
      }
      window.location.href = "thanh-toan.html";
    });

    const observer = new MutationObserver(() => {
      cartModal.style.background = document.body.classList.contains("dark-mode")
        ? "var(--bg-dark)"
        : "var(--bg-light)";
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <span class="material-icons-round" style="font-size: 64px; color: var(--primary-light); opacity: 0.3; margin-bottom: 20px;">shopping_cart</span>
        <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Giỏ hàng trống</p>
        <p style="font-size: 14px; opacity: 0.6;">Hãy thêm sản phẩm vào giỏ hàng</p>
        <button onclick="document.querySelector('.cart-close').click()" style="margin-top: 24px; background: var(--primary-light); color: white; border: none; padding: 12px 30px; border-radius: 40px; font-weight: 600; cursor: pointer;">
          TIẾP TỤC MUA SẮM
        </button>
      </div>
    `;
    totalEl.textContent = "0 ₫";
    return;
  }

  let total = 0;
  container.innerHTML = cart
    .map((item, index) => {
      const price = parseFloat(item.price.replace(/[₫$,.]/g, "").trim()) || 0;
      const itemTotal = price * item.quantity;
      total += itemTotal;

      return `
        <div class="cart-item" style="display: flex; gap: 16px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); position: relative;">
          <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; background: var(--surface-light); flex-shrink: 0;">
            <img src="images/${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${item.name}</h4>
                <p style="font-size: 13px; opacity: 0.6; margin-bottom: 8px;">${item.variant || "Tiêu chuẩn"}</p>
              </div>
              <!-- NÚT XÓA SẢN PHẨM -->
              <button onclick="removeFromCart(${index})" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 4px;" aria-label="Xóa sản phẩm">
                <span class="material-icons-round" style="font-size: 20px;">delete</span>
              </button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <button onclick="updateCartItemQuantity(${index}, -1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">−</button>
                <span style="font-weight: 600; min-width: 24px; text-align: center;">${item.quantity}</span>
                <button onclick="updateCartItemQuantity(${index}, 1)" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
              </div>
              <span style="font-weight: 700; color: var(--primary-light);">${new Intl.NumberFormat("vi-VN").format(itemTotal)} ₫</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  totalEl.textContent = new Intl.NumberFormat("vi-VN").format(total) + " ₫";
}

function loadCartCount() {
  const saved = localStorage.getItem("brianLuuCart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
  updateCartCount();
}

// ===== QUANTITY CONTROLS =====
function initQuantityControls() {
  window.increaseQty = () => {
    const q = document.getElementById("quantity");
    if (q) q.value = parseInt(q.value) + 1;
  };
  window.decreaseQty = () => {
    const q = document.getElementById("quantity");
    if (q && parseInt(q.value) > 1) q.value = parseInt(q.value) - 1;
  };
}

// ===== MINI SLIDER =====
function initMiniSlider() {
  const slides = document.querySelectorAll(".mini-slide");
  const dots = document.querySelectorAll(".mini-dot");
  if (!slides.length) return;

  let current = 0;
  const show = (i) => {
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    current = i;
  };

  setInterval(() => show(current + 1), 3000);
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
  show(0);
}

// ===== POSTER SLIDER =====
function initPosterSliders() {
  document.querySelectorAll('[id^="posterSlider"]').forEach((slider) => {
    const slides = slider.querySelectorAll(".poster-slide");
    const dots = slider
      .closest(".dynamic-poster")
      ?.querySelectorAll(".poster-dot");
    if (!slides.length || !dots) return;

    let current = 0;
    const show = (i) => {
      if (i < 0) i = slides.length - 1;
      if (i >= slides.length) i = 0;
      slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      current = i;
    };

    setInterval(() => show(current + 1), 4000);
    dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
    show(0);
  });
}
// Update cart count
function updateCartCount() {
  const cartBtns = document.querySelectorAll(".cart-btn");
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  cartBtns.forEach((btn) => {
    let dot = btn.querySelector(".cart-dot");
    if (!dot) {
      dot = document.createElement("span");
      dot.className = "cart-dot";
      btn.appendChild(dot);
    }

    if (count > 0) {
      dot.style.display = "flex";
      dot.style.width = "18px";
      dot.style.height = "18px";
      dot.style.backgroundColor = "#064e3b";
      dot.style.color = "white";
      dot.style.borderRadius = "50%";
      dot.style.alignItems = "center";
      dot.style.justifyContent = "center";
      dot.style.fontSize = "10px";
      dot.style.position = "absolute";
      dot.style.top = "5px";
      dot.style.right = "5px";
      dot.textContent = count > 9 ? "9+" : count;
    } else {
      dot.style.display = "none";
    }
  });
}

function refreshCart() {
  const saved = localStorage.getItem("brianLuuCart");
  if (saved) {
    try {
      window.cart = JSON.parse(saved);
      cart = window.cart;
    } catch (e) {
      window.cart = [];
      cart = [];
    }
  } else {
    window.cart = [];
    cart = [];
  }
  updateCartCount();
  const cartModal = document.querySelector(".cart-modal");
  if (cartModal && cartModal.style.right === "0px") {
    renderCartItems();
  }
}

// ===== REMOVE FROM CART =====
window.removeFromCart = function (index) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    cart.splice(index, 1);
    localStorage.setItem("brianLuuCart", JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    showToast("🗑️ Đã xóa sản phẩm khỏi giỏ hàng");
  }
};

// ===== UPDATE CART ITEM QUANTITY =====
window.updateCartItemQuantity = function (index, change) {
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      localStorage.setItem("brianLuuCart", JSON.stringify(cart));
      renderCartItems();
      updateCartCount();
    }
  }
};

// ===== EXPORT CÁC HÀM RA GLOBAL =====
window.refreshCart = refreshCart;
window.updateCartCount = updateCartCount;
window.loadCartCount = loadCartCount;
window.cart = cart;

// ===== EVENT LISTENERS =====
window.addEventListener("storage", function (e) {
  if (e.key === "brianLuuCart") {
    refreshCart();
  }
});

window.addEventListener("cartUpdated", function () {
  refreshCart();
});

// ===== DEBUG =====
setInterval(() => {
  if (cart && cart.length > 0) {
    console.log("🛒 Cart current:", cart);
  }
}, 3000);
