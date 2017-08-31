document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({isDisplayDefault: false}, (config) => {
    document.querySelectorAll('.radio').forEach((radio) => {
      if (radio.value === config.isDisplayDefault.toString()) {
        radio.setAttribute('checked', 'true')
      }
    })
  })

  Array.from(document.querySelectorAll('.radio')).map((radio) => {
    radio.addEventListener('change', function () {
      chrome.storage.local.set({isDisplayDefault: this.value == 'true'})
    })
  })
})
