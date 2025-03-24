$(document).ready(function () {

  $('.navbar').on('affix.bs.affix', function () {
    if (!$(window).scrollTop()) {
      return false;
    }
  });

  setTimeout(function () {
    $('body').addClass('loaded');
    new WOW().init();
    $('.navbar.navbar-default').affix({
      offset: {top: 0}
    });

  }, 3000);

  $(".navbar-collapse .navbar-nav>li>a").click(function () {
    $('.navbar-collapse').removeClass('in');
  });

  $('.gift-reg-slideset').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }

    ]
  });

  $('#wedding-nav a[href^="#"], .link-smooth-scroll').on('click',
      function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
          event.preventDefault();
          var bmoffset = target.offset().top;
          if (bmoffset > '4000') {
            $('html, body').stop().animate({
              scrollTop: target.offset().top
            }, 2000);
          } else {
            $('html, body').stop().animate({
              scrollTop: target.offset().top
            }, 4000);
          }
        }
      });

  $('#countdown').countdown({

    date: '5 september 2026 23:5'

  });

  $('#photos a').simpleLightbox({
    closeText: 'X',
    navText: ['&lsaquo;', '&rsaquo;']

  });

  $(".form-control").focus(function () {
    $(this).closest(".input-group").addClass("input-group-focus");
  }).blur(function () {
    $(this).closest(".input-group").removeClass("input-group-focus");
  });

  "use strict";
  $('#submit').click(function () {

    var action = $('#contactform').attr('action');

    $("#message").fadeOut(200, function () {
      $('#message').hide();

      $('#submit')
      .attr('disabled', 'disabled');

      $.post(action, {
            name: $('#name').val(),
            email: $('#email').val(),
            numberofguests: $('#numberofguests').val(),
            attendto: $('#attendto').val(),
            comments: $('#comments').val()
          },
          function (data) {
            document.getElementById('message').innerHTML = data;
            $('#message').fadeIn(200);
            $('.hide').hide(0);
            $('#submit').removeAttr('disabled');
          }
      );

    });

    return false;
  });

  const music = document.getElementById('music-source');
  const musicControl = document.getElementById('music-control');
  const musicIcon = musicControl.querySelector('img');

  musicControl.addEventListener('click', function () {
    if (music.paused) {
      music.play();
      musicControl.classList.add('playing');
      musicIcon.src = 'images/playing.png';
    } else {
      music.pause();
      musicControl.classList.remove('playing');
      musicIcon.src = 'images/pause.png';
    }
  });

  $(window).on('load', function () {
    music.play();
    musicControl.classList.add('playing');
    musicIcon.src = 'images/playing.png';
  });

});

function fetchWishesFromGoogleSheets() {
  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx-NVt-Uhiof-2ORcBcbwlaSjDHESvTtlVC5d_s5U3m2yqlf6IMjwOSLha__Bsitaldrw/exec';

  fetch(WEBAPP_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }
    return response.json();
  })
  .then(jsonData => {
    console.log('Data received:', jsonData);

    if (jsonData && jsonData.success && jsonData.data) {
      displayWishes(jsonData.data);
    } else {
      console.error('Lỗi từ Apps Script:', jsonData);
      document.getElementById('wishes-container').innerHTML =
          '<p class="text-center">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching wishes:', error);
    document.getElementById('wishes-container').innerHTML =
        '<p class="text-center">Không thể tải lời chúc. Vui lòng thử lại sau.</p>';
  });
}

function displayWishes(data) {
  const container = document.getElementById('wishes-container');
  container.innerHTML = '';

  const wishes = data.slice(1);

  if (wishes.length === 0) {
    container.innerHTML = '<p class="text-center">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc!</p>';
    return;
  }

  wishes.sort((a, b) => new Date(b[0]) - new Date(a[0]));

  wishes.slice(0, 10).forEach(wish => {
    const timestamp = new Date(wish[0]);
    const email = wish[1];
    const attending = wish[2];
    const message = wish[3];

    const name = email.split('@')[0];

    const formattedDate = `${timestamp.getDate()}/${timestamp.getMonth()
    + 1}/${timestamp.getFullYear()}`;

    const wishHTML = `
            <div class="col-md-6">
                <div class="wish-card">
                    <h4 class="wish-name">${name}</h4>
                    <p class="wish-date">${formattedDate}</p>
                    <p class="wish-message">${message}</p>
                </div>
            </div>
        `;

    container.innerHTML += wishHTML;
  });
}

$(document).ready(function () {
  if (document.getElementById('wishes-container')) {
    fetchWishesFromGoogleSheets();
  }
});

function doGet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sheet = ss.getSheetByName("Câu trả lời biểu mẫu 1");
    if (!sheet) {
      return jsonResponse({success: false, error: "Sheet không tồn tại"});
    }

    const data = sheet.getDataRange().getValues();

    return jsonResponse({success: true, data: data});
  } catch (error) {
    return jsonResponse({success: false, error: error.toString()});
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
  .setMimeType(ContentService.MimeType.JSON);
}

function loadWishes() {
  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx-NVt-Uhiof-2ORcBcbwlaSjDHESvTtlVC5d_s5U3m2yqlf6IMjwOSLha__Bsitaldrw/exec';

  console.log('Đang tải lời chúc...');

  fetch(WEBAPP_URL)
  .then(response => {
    console.log('Nhận được response:', response.status);
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }
    return response.json();
  })
  .then(jsonData => {
    console.log('Data nhận được:', jsonData);

    if (jsonData && jsonData.success && Array.isArray(jsonData.data)) {
      console.log('Số dòng dữ liệu:', jsonData.data.length);
      if (jsonData.data.length > 0) {
        console.log('Dòng đầu tiên:', jsonData.data[0]);
      }

      displayWishesInCarousel(jsonData.data);
    } else {
      console.error('Lỗi cấu trúc dữ liệu:', jsonData);
      displayErrorInCarousel('Dữ liệu không đúng định dạng');
    }
  })
  .catch(error => {
    console.error('Error fetching wishes:', error);
    displayErrorInCarousel('Không thể tải lời chúc: ' + error.message);
  });
}

function displayErrorInCarousel(message) {
  const carouselInner = document.getElementById('wishes-carousel');
  if (carouselInner) {
    carouselInner.innerHTML = `
            <div class="item active flex-container flex-column">
                <div class="testimonial-quotation bg-white">
                    <blockquote class="text-regular position-relative">
                        <i class="fa fa-quote-left text-pink position-absolute" aria-hidden="true"></i>
                        ${message}
                    </blockquote>
                </div>
                <div class="row testimonial-friend-details">
                    <div class="col-sm-2 col-xs-3 padding-remove testimonial-friend-picture">
                        <div class="avatar-wrapper">
                            <img class="img-responsive circular-avatar" src="images/avatar_common.jpg" alt="Friends Picture">
                        </div>
                    </div>
                    <div class="col-sm-4 col-xs-7">
                        <p class="testimonial-friend-name text-capitalize text-pink">Thông báo</p>
                        <p class="text-regular text-white text-capitalize">Hệ thống</p>
                    </div>
                </div>
            </div>
        `;
  }
}

function displayWishesInCarousel(data) {
  const carouselInner = document.getElementById('wishes-carousel');
  const indicators = document.querySelector('.carousel-indicators');

  if (!carouselInner || !indicators) {
    console.error('Không tìm thấy phần tử HTML cần thiết');
    return;
  }

  console.log('Bắt đầu hiển thị lời chúc...');

  try {
    carouselInner.innerHTML = '';
    indicators.innerHTML = '';

    const wishes = data.slice(1);
    console.log('Số lời chúc sau khi bỏ tiêu đề:', wishes.length);

    wishes.sort((a, b) => {
      try {
        return new Date(b[0]) - new Date(a[0]);
      } catch (e) {
        console.error('Lỗi khi sắp xếp:', e);
        return 0;
      }
    });

    const maxWishes = Math.min(wishes.length, 20);
    console.log('Số lời chúc sẽ hiển thị:', maxWishes);

    if (maxWishes === 0) {
      carouselInner.innerHTML = `
                <div class="item active flex-container flex-column">
                    <div class="testimonial-quotation bg-white">
                        <blockquote class="text-regular position-relative">
                            <i class="fa fa-quote-left text-pink position-absolute" aria-hidden="true"></i>
                            Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc!
                        </blockquote>
                    </div>
                    <div class="row testimonial-friend-details">
                        <div class="col-sm-2 col-xs-3 padding-remove testimonial-friend-picture">
                            <img class="img-responsive" src="images/rose_marry.png" alt="Friends Picture">
                        </div>
                        <div class="col-sm-4 col-xs-7">
                            <p class="testimonial-friend-name text-capitalize text-pink">-</p>
                            <p class="text-regular text-white text-capitalize">-</p>
                        </div>
                    </div>
                </div>
            `;
      return;
    }

    for (let i = 0; i < maxWishes; i++) {
      try {
        const wish = wishes[i];

        if (!wish || !Array.isArray(wish) || wish.length < 5) {
          console.warn(`Dữ liệu lời chúc không hợp lệ ở vị trí ${i}`, wish);
          continue;
        }

        const name = wish[1] || "Khách mời";
        const side = wish[3] || "";
        const message = wish[4] || "Không có nội dung";

        let relationshipText = "";
        if (side && side.trim() !== "" && !side.includes("Cả hai")) {
          relationshipText = side;
        } else {
          relationshipText = "Khách mời";
        }

        const indicator = document.createElement('li');
        indicator.setAttribute('data-target', '#testimonial-carousel');
        indicator.setAttribute('data-slide-to', i.toString());
        indicator.style.margin = "5px";
        if (i === 0) {
          indicator.classList.add('active');
        }
        indicators.appendChild(indicator);

        const itemHTML = `
                    <div class="item ${i === 0 ? 'active' : ''} flex-container flex-column">
                        <div class="testimonial-quotation bg-white">
                            <blockquote class="text-regular position-relative">
                                <i class="fa fa-quote-left text-pink position-absolute" aria-hidden="true"></i>
                                ${sanitizeHTML(message)}
                            </blockquote>
                        </div>
                        <div class="row testimonial-friend-details">
                            <div class="col-sm-2 col-xs-3 padding-remove testimonial-friend-picture">
                                <img class="img-responsive" src="images/avatar_common.jpg" alt="Friends Picture">
                            </div>
                            <div class="col-sm-4 col-xs-7">
                                <p class="testimonial-friend-name text-capitalize text-white">${sanitizeHTML(
            name)}</p>
                                <p class="text-regular text-white text-capitalize">${sanitizeHTML(
            relationshipText)}</p>
                            </div>
                        </div>
                    </div>
                `;

        carouselInner.innerHTML += itemHTML;
      } catch (error) {
        console.error(`Lỗi khi xử lý lời chúc thứ ${i}:`, error);
      }
    }

    $('#testimonial-carousel').carousel();
  } catch (error) {
    console.error('Lỗi trong quá trình hiển thị lời chúc:', error);
  }
}

function sanitizeHTML(text) {
  if (text === null || text === undefined) {
    return "";
  }
  if (typeof text !== 'string') {
    text = String(text);
  }
  const temp = document.createElement('div');
  temp.textContent = text;
  return temp.innerHTML;
}

function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

$(document).ready(function () {
  setTimeout(function () {
    console.log('DOM đã tải, bắt đầu tải lời chúc...');
    if (document.getElementById('wishes-carousel')) {
      loadWishes();
    } else {
      console.error('Không tìm thấy phần tử wishes-carousel');
    }
  }, 1000);
});