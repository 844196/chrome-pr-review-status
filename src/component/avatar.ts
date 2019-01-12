export function generate(iconUrl: string) {
  const avatar = document.createElement('img');
  avatar.src = iconUrl;
  avatar.width = 20;
  avatar.height = 20;
  avatar.style.marginRight = '2px';
  avatar.style.marginLeft = '2px';
  avatar.classList.add('avatar');
  return avatar;
}
