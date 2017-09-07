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

        // TODO 設定可能にする
        let isCompactDisplay = true

        if (isCompactDisplay) {
          let reviewerItem = reviewers.querySelector('.css-truncate')

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
            let p = document.createElement('p');
            let v = statusArray[key]
            let status = v[0]['status']
            status.classList.remove('float-right')
            status.classList.add('float-left')
            status.style.width = '20px'
            p.insertBefore(status, p.nextSibling)
            for(k in v) {
              p.insertBefore(v[k]['img'], p.nextSibling)
            }
            reviewerItem.appendChild(p)
          }
        }

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
