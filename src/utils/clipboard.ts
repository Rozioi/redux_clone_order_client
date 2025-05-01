export const copyUrl = (id: string | number, url: string) => {
    const href = window.location.origin; 
    const urlNew = `${href}${url}${id}`;     
    navigator.clipboard.writeText(urlNew)
      .then(() => {
        console.log('Ссылка скопирована:', url);
      })
      .catch((err) => {
        console.error('Ошибка копирования ссылки:', err);
      });
  };

export const copyClipboard = (info:string) => {
    navigator.clipboard.writeText(info)
      .then(() => {
        console.log('Ссылка скопирована:', info);
      })
      .catch((err) => {
        console.error('Ошибка копирования ссылки:', err);
      });
}