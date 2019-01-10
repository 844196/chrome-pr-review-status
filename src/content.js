(() => {
  const fetchReviewStatusList = Array.from(document.querySelectorAll('.js-issue-row')).map((row) => {
    if (row.querySelector('.review-status')) {
      return Promise.resolve()
    }

    return fetch(row.querySelector('a.h4').href, {credentials: 'include'})
      .then((fetched) => fetched.text())
      .then((fetched) => {
        let page = document.createElement('html')
        page.innerHTML = fetched

        let reviewers = page.querySelector('.discussion-sidebar-item')

        let reviewerItem = reviewers.querySelector('.css-truncate')

        chrome.storage.local.get({enableBackgroundColor: false}, (config) => {
          if (config.enableBackgroundColor === false) {
            return
          }
          let myName = '@' + (document.getElementsByName('user-login')[0]['content'])

          for (let key = 0; key < reviewerItem.children.length; key++) {
            let item = reviewerItem.children[key]
            if (myName == item.querySelector('img')['alt']) {
              let classList = item.querySelector('.reviewers-status-icon').querySelector('svg').classList
              if (classList.contains('octicon-check')) {
                row.style['background-color'] = '#b9f3d2'
              } else if (classList.contains('octicon-primitive-dot')) {
                row.style['background-color'] = '#f3f3b9'
              } else if (classList.contains('octicon-x')) {
                row.style['background-color'] = '#f3b9b9'
              } else if (classList.contains('octicon-comment')) {
                row.style['background-color'] = '#e2e2e2'
              }
            }
          }
        })

        chrome.storage.local.get({isCompactDisplay: false}, (config) => {
          if (config.isCompactDisplay === false) {
            return
          }

          let statusArray = {}
          for (let key = 0; key < reviewerItem.children.length; key++) {
            item = reviewerItem.children[key]
            let value = {
              img:    item.querySelector('img'),
              status: item.querySelector('.reviewers-status-icon')
            }
            let status = value['status'].firstElementChild['classList']['value']

            if (typeof statusArray[status] == 'undefined') statusArray[status] = []
            statusArray[status].push(value)
          }

          reviewerItem.querySelectorAll('p').forEach(function(value) {
            value.remove()
          })

          for(key in statusArray){
            let pre = document.createElement('p');
            let value = statusArray[key]
            let status = value[0]['status']
            status.classList.remove('float-right')
            status.classList.add('float-left')
            status.style.width = '20px'
            pre.insertBefore(status, pre.nextSibling)
            for(k in value) {
              pre.insertBefore(value[k]['img'], pre.nextSibling)
            }
            reviewerItem.appendChild(pre)
          }
        })

        reviewers.classList.add('review-status', 'float-left', 'col-3', 'p-2')
        reviewers.style.display = 'none'

        let prInfo = row.querySelector('.col-9')
        prInfo.classList.remove('col-9')
        prInfo.classList.add('col-6')

        prInfo.parentNode.insertBefore(reviewers, prInfo.nextSibling)
      })
  })

  let existsBtn = document.getElementById('status-display-toggle-btn')
  if (existsBtn) {
    existsBtn.parentNode.removeChild(existsBtn)
  }

  let btn = document.createElement('button')
  btn.id = 'status-display-toggle-btn'
  btn.classList.add('btn', 'btn-default', 'float-right', 'mr-2')
  btn.textContent = 'Fetching...'
  btn.dataset.isActive = false
  btn.setAttribute('disabled', true)
  document.querySelector('.subnav').appendChild(btn)

  Promise
    .all(fetchReviewStatusList)
    .then(() => {
      btn.removeAttribute('disabled')
      btn.innerText = 'Toggle review status display'
    })
    .then(() => {
      document
        .getElementById('status-display-toggle-btn')
        .addEventListener('click', function () {
          const isActive = this.dataset.isActive == 'true'

          document.querySelectorAll('.review-status').forEach((item) => {
            item.style.display = isActive ? 'none' : 'block'
          })

          this.dataset.isActive = !isActive
        })
    })
    .then(() => {
      chrome.storage.local.get({isDisplayDefault: false}, (config) => {
        if (config.isDisplayDefault === false) {
          return
        }
        btn.dispatchEvent(new Event('click'))
      })
    })
})()
