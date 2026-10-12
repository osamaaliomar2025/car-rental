// كود تشغيل الواجهة بـ jQuery
$(document).ready(function() {

    // تشغيل وإخفاء تفاصيل السيارات من الجدول
    $('.btn-toggle-details').change(function() {
        $(this).closest('tr').next('.details-row').toggle(200);
    });

    // كود زر المتابعة لفتح الفورم
    $('#btnContinue').click(function() {
        // حساب كم سيارة تحددت
        var checkedCars = $('.select-car:checked').length;
        
        if (checkedCars == 0) {
            alert('الرجاء اختيار سيارة واحدة على الأقل من الجدول قبل المتابعة');
            $('#formSection').hide();
        } else {
            // إظهار الفورم فوراً
            $('#formSection').show();
            // النزول لأسفل الصفحة تلقائياً ليرى الأستاذ الفورم
            $('html, body').animate({
                scrollTop: $("#formSection").offset().top
            }, 500);
        }
    });
});

// دالة فحص حقول الحجز عند الإرسال بـ Javascript
function validateForm() {
    var uName = document.getElementById('fullName').value.trim();
    var uId = document.getElementById('nationalId').value.trim();
    var d1 = document.getElementById('startDate').value;
    var d2 = document.getElementById('endDate').value;
    var uMobile = document.getElementById('mobile').value.trim();
    var uMail = document.getElementById('email').value.trim();

    // فحص الاسم إذا انكتب
    if (uName != "") {
        var checkAr = /^[\u0600-\u06FF\s]+$/;
        if (!checkAr.test(uName)) {
            alert("خطأ: الاسم لازم يكون بالأحرف العربية وبس");
            return false;
        }
    }

    // فحص الرقم الوطني الإلزامي
    if (uId == "") {
        alert("خطأ: الرقم الوطني حقل إجباري");
        return false;
    }
    var checkId = /^(0[1-9]|1[0-4])\d{9}$/;
    if (!checkId.test(uId) || uId.length != 11) {
        alert("خطأ: الرقم الوطني غلط، لازم 11 خانة ويبدأ برمز محافظة صحيح بين 01 و 14");
        return false;
    }

    // فحص التواريخ
    if (d1 == "" || d2 == "") {
        alert("خطأ: يرجى تحديد تاريخ البداية والنهاية");
        return false;
    }

    var dateStart = new Date(d1);
    var dateEnd = new Date(d2);

    if (dateEnd <= dateStart) {
        alert("خطأ: تاريخ نهاية التأجير لازم يكون بعد تاريخ البداية");
        return false;
    }

    // فحص الموبايل السوري
    if (uMobile != "") {
        var checkMob = /^09(3|4|5|6|8|9)\d{7}$/;
        if (!checkMob.test(uMobile)) {
            alert("خطأ: رقم الموبايل غير صحيح، لازم يبدأ بـ 09 ويتبع لشبكة سيريتل أو ام تي ان");
            return false;
        }
    }

    // فحص الايميل
    if (uMail != "") {
        var checkMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!checkMail.test(uMail)) {
            alert("خطأ: صيغة البريد الإلكتروني غير مقبولة");
            return false;
        }
    }

    // حساب الفواتير والأسعار عند نجاح المدخلات
    var diff = Math.abs(dateEnd.getTime() - dateStart.getTime());
    var daysNum = Math.ceil(diff / (1000 * 3600 * 24)); 

    var listCars = "";
    var costBefore = 0;

    $('.select-car:checked').each(function() {
        var currentTr = $(this).closest('tr');
        var model = currentTr.find('.car-model').text();
        var pDaily = parseFloat(currentTr.find('.price-val').text());
        
        listCars += "- " + model + "\n";
        costBefore += (pDaily * daysNum);
    });

    // خصم 10% إذا الحجز أكتر من 7 أيام
    var discountVal = 0;
    var finalPay = costBefore;
    if (daysNum > 7) {
        discountVal = costBefore * 0.10;
        finalPay = costBefore - discountVal;
    }

    // رسالة النجاح النهائية بالفصحى المبسطة لتظهر للأستاذ
    var msg = "تم قبول طلب الحجز بنجاح!\n\n";
    msg += "السيارات المحجوزة:\n" + listCars + "\n";
    msg += "عدد الأيام: " + daysNum + " أيام.\n";
    msg += "الحساب المبدئي: " + costBefore + " ل.س.\n";
    if (daysNum > 7) {
        msg += "خصم الإيجار الطويل (10%): " + discountVal + " ل.س.\n";
    }
    msg += "المبلغ الصافي المطلوب: " + finalPay + " ل.س.";

    alert(msg);
    return false; 
}
