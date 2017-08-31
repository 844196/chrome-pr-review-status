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
        reviewers.classList.add('review-status', 'float-left', 'col-3', 'p-2')

        let prInfo = row.querySelector('.col-9')
        prInfo.classList.remove('col-9')
        prInfo.classList.add('col-6')

        prInfo.parentNode.insertBefore(reviewers, prInfo.nextSibling)
      })
  })

  Promise.all(fetchReviewStatusList)
})()
