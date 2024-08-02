const btn = document.getElementById('menu')
const nav = document.getElementById('menu-box')
const cls = document.getElementById('menu-x')

btn.addEventListener('click', () => {
  nav.classList.toggle('flex')
  nav.classList.toggle('hidden')
})

cls.addEventListener('click', () => {
  nav.classList.toggle('flex')
  nav.classList.toggle('hidden')
})

var tablinks = document.getElementsByClassName('tab-links')
var tabcontents = document.getElementsByClassName('tab-contents')

function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove('active-link')
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove('active-tab')
  }
  event.currentTarget.classList.add('active-link')
  document.getElementById(tabname).classList.add('active-tab')
}

function previewImage(event) {
  var reader = new FileReader()
  reader.onload = function () {
    var output = document.getElementById('imagePreview')
    output.src = reader.result
    document.querySelector('.image-section').classList.remove('hidden')
  }
  reader.readAsDataURL(event.target.files[0])
}

document.getElementById('btn-predict').addEventListener('click', function () {
  document.querySelector('.loader').classList.remove('hidden')
})

$(document).ready(function () {
  $('.image-section').hide()
  $('.loader').hide()
  $('#result').hide()
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader()
      reader.onload = function (e) {
        $('#imagePreview').attr('src', e.target.result)
      }
      reader.readAsDataURL(input.files[0])
    }
  }
  $('#imageUpload').change(function () {
    $('.image-section').show()
    $('#btn-predict').show()
    $('#result').text('')
    $('#result').hide()
    readURL(this)
  })

  $('#btn-predict').click(function () {
    var form_data = new FormData($('#upload-file')[0])
    $(this).hide()
    $('.loader').show()
    $.ajax({
      type: 'POST',
      url: '/predict',
      data: form_data,
      contentType: false,
      cache: false,
      processData: false,
      async: true,
      success: function (data) {
        $('.loader').hide()
        $('#result').fadeIn(500)
        $('#result').html(
          '<p style="font-weight: 900; font-size: 1.5rem; line-height: 2rem; text-align: center; margin-bottom: 1.25rem;">Result:</p><p style="font-weight: 900; font-size: 1.5rem; line-height: 2rem; text-align: center; margin-bottom: 1.25rem;">' +
            data +
            '<p style="text-align: center;"><a href="about.html" style="color: green;">Learn More</a></p>',
        )
        console.log('Success!')
      },
    })
  })
})
