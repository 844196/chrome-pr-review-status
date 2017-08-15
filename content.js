document.querySelectorAll('.js-issue-row').forEach((row) => {
  fetch(row.querySelector('a.h4').href, {credentials: 'include'})
    .then((res) => res.text())
    .then((res) => {
      let prPage = document.createElement('div')
      prPage.innerHTML = res
      sidebar = prPage.querySelector('#partial-discussion-sidebar')

      let reviewers = Array.from(sidebar.children).find((item) => {
        return item.querySelector('.discussion-sidebar-heading').textContent.match(/Reviewers/)
      })

      reviewers.style.paddingTop = 'inherit'
      reviewers.classList.add('float-left')
      reviewers.classList.add('col-3')
      reviewers.classList.add('p-2')

      let prInfo = row.querySelector('.col-9')
      prInfo.classList.remove('col-9')
      prInfo.classList.add('col-6')

      prInfo.parentNode.insertBefore(reviewers, prInfo.nextSibling)
    })
})
