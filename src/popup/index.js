document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({
      isDisplayDefault: false,
      isCompactDisplay: false,
      enableBackgroundColor: false
    }, (config) => {
    document.querySelectorAll('.radio').forEach((radio) => {
      switch (radio.name) {
        case 'default':
          if (radio.value === config.isDisplayDefault.toString()) {
            radio.setAttribute('checked', 'true')
          }
          break;
        case 'compact':
          if (radio.value === config.isCompactDisplay.toString()) {
            radio.setAttribute('checked', 'true')
          }
          break;
        case 'bg':
          if (radio.value === config.enableBackgroundColor.toString()) {
            radio.setAttribute('checked', 'true')
          }
          break;
      }
    })
  })

  Array.from(document.querySelectorAll('.radio')).map((radio) => {
    switch (radio.name) {
      case 'default':
        radio.addEventListener('change', function () {
          chrome.storage.local.set({isDisplayDefault: this.value == 'true'})
        })
        break;
      case 'compact':
        radio.addEventListener('change', function () {
          chrome.storage.local.set({isCompactDisplay: this.value == 'true'})
        })
        break;
      case 'bg':
        radio.addEventListener('change', function () {
          chrome.storage.local.set({enableBackgroundColor: this.value == 'true'})
        })
        break;
    }
  })
})
