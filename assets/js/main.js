// รอให้หน้าเว็บโหลดเสร็จก่อนค่อยทำงาน
document.addEventListener('DOMContentLoaded', function() {
    
    // ค้นหาปุ่ม Hamburger และ กล่องเมนู
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // ถ้าเจอปุ่ม Hamburger ให้ดักจับการคลิก
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // สลับสถานะเปิด/ปิดเมนู (เพิ่มหรือลบคลาส 'active')
            navLinks.classList.toggle('active');
        });
    }
    // ==========================================
    // ระบบ Filter สำหรับหน้า Portfolio และ Articles
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.portfolio-item, .article-card');

    // เช็คว่ามีปุ่ม Filter ในหน้านี้ไหม ถ้ามีค่อยทำงาน
    if (filterButtons.length > 0 && filterItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. เอาคลาส active สีทึบออกจากทุกปุ่ม แล้วใส่ให้ปุ่มที่ถูกคลิก
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 2. ดึงค่าว่าปุ่มนี้คือหมวดหมู่ไหน
                const filterValue = button.getAttribute('data-filter');

                // 3. สั่งซ่อน/แสดง การ์ดผลงาน
                filterItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.style.display = 'block';
                        // ลบและใส่คลาส fade-in ใหม่ เพื่อให้แอนิเมชันทำงานทุกครั้งที่กด
                        item.classList.remove('fade-in');
                        void item.offsetWidth; // บังคับให้เบราว์เซอร์รีเฟรชแอนิเมชัน
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
// ==========================================
    // ระบบค้นหาและ Filter สำหรับหน้า Packages
    // ==========================================
    const packageCards = document.querySelectorAll('.package-card');
    const filterForm = document.querySelector('.filter-form');
    
    if (packageCards.length > 0 && filterForm) {
        const regionSelect = filterForm.querySelector('select[name="region"]');
        const durationSelect = filterForm.querySelector('select[name="duration"]');
        const budgetSelect = filterForm.querySelector('select[name="budget"]');
        const filterBtn = filterForm.querySelector('.btn-filter');

        // ฟังก์ชันหัวใจหลักสำหรับการกรองข้อมูล
        const filterPackages = (searchKeyword = '') => {
            const region = regionSelect.value;
            const duration = durationSelect.value;
            const budget = budgetSelect.value;
            const keyword = searchKeyword.toLowerCase();

            packageCards.forEach(card => {
                const cardRegion = card.getAttribute('data-region');
                const cardDuration = card.getAttribute('data-duration');
                const cardBudget = card.getAttribute('data-budget');
                // กวาดข้อความทั้งหมดในการ์ดมาแปลงเป็นตัวพิมพ์เล็กเพื่อหา keyword
                const cardText = card.innerText.toLowerCase();

                // เช็คเงื่อนไขทีละข้อ
                const matchRegion = (region === 'all' || region === cardRegion);
                const matchDuration = (duration === 'all' || duration === cardDuration);
                const matchBudget = (budget === 'all' || budget === cardBudget);
                const matchKeyword = (keyword === '' || cardText.includes(keyword));

                // ถ้าตรงทุกเงื่อนไข ให้แสดงการ์ดนั้นขึ้นมา
                if (matchRegion && matchDuration && matchBudget && matchKeyword) {
                    card.style.display = 'flex'; // ใช้ flex เพื่อให้ปุ่มอยู่ด้านล่างเสมอ
                    card.classList.remove('fade-in');
                    void card.offsetWidth; // รีเฟรชแอนิเมชัน
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // 1. ดักจับการกดปุ่ม "กรองข้อมูล" ในหน้า packages.html
        filterBtn.addEventListener('click', () => {
            filterPackages(); 
        });

        // 2. ระบบอ่านค่าจาก URL (รับออเดอร์ข้ามหน้ามาจาก index.html)
        // เมื่อลูกค้าค้นหาหน้าแรก URL จะมีหน้าตาแบบนี้: packages.html?keyword=ภูเก็ต&region=south
        const urlParams = new URLSearchParams(window.location.search);
        const urlKeyword = urlParams.get('keyword');
        const urlRegion = urlParams.get('region');

        // ถ้ามีพารามิเตอร์ส่งมา ให้ทำงานทันที
        if (urlKeyword || urlRegion) {
            // ปรับ dropdown ให้แสดงตรงกับที่ลูกค้าเลือกมา
            if (urlRegion) {
                regionSelect.value = urlRegion; 
            }
            
            // หน่วงเวลา 0.1 วินาทีให้หน้าเว็บจัดเรียงตัวเองเสร็จก่อน แล้วค่อยสั่งกรอง
            setTimeout(() => {
                filterPackages(urlKeyword || '');
            }, 100);
        }
    }
    
});