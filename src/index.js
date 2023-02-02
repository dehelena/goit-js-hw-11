import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay-api';
import { galleryMarkup } from './galleryMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

const pixabayAPI = new PixabayAPI();

async function onFormSubmit(e) {
  e.preventDefault();
  const inputValue = e.target.elements.searchQuery.value.trim();
  if (!inputValue) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryEl.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');
    return;
  }

  pixabayAPI.query = inputValue;
  pixabayAPI.resetPage();
  loadMoreBtn.classList.add('is-hidden');

  try {
    const response = await pixabayAPI.fetchPhotos();

    const {
      data: { hits, totalHits },
    } = response;

    if (!pixabayAPI.query || hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
      e.target.reset();
      return;
    }

    if (totalHits > 40) {
      loadMoreBtn.classList.remove('is-hidden');
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);
    galleryEl.innerHTML = galleryMarkup(hits);
    lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
}

//   pixabayAPI
//     .fetchPhotos()
//     .then(response => {
//       const {
//         data: { hits, totalHits },
//       } = response;

//       if (!pixabayAPI.query || hits.length === 0) {
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//         galleryEl.innerHTML = '';
//         e.target.reset();
//         return;
//       }

//       if (totalHits > 40) {
//         loadMoreBtn.classList.remove('is-hidden');
//       }

//       Notify.success(`Hooray! We found ${totalHits} images.`);
//       galleryEl.innerHTML = galleryMarkup(hits);
//       lightbox.refresh();
//     })
//     .catch(err => console.log(err));
// }

async function onLoadMoreBtnClick(e) {
  pixabayAPI.incrementPage();

  try {
    const response = await pixabayAPI.fetchPhotos();

    const {
      data: { hits, totalHits },
    } = response;
    pixabayAPI.setTotal(totalHits);
    const hasMore = pixabayAPI.hasMorePhotos();

    galleryEl.insertAdjacentHTML('beforeend', galleryMarkup(hits));
    lightbox.refresh();

    //плавне прокручування
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (!hasMore) {
      Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

//   pixabayAPI
//     .fetchPhotos()
//     .then(response => {
//       const {
//         data: { hits, totalHits },
//       } = response;
//       pixabayAPI.setTotal(totalHits);
//       const hasMore = pixabayAPI.hasMorePhotos();

//       galleryEl.insertAdjacentHTML('beforeend', galleryMarkup(hits));
//       lightbox.refresh();

//       //плавне прокручування
//       const { height: cardHeight } = document
//         .querySelector('.gallery')
//         .firstElementChild.getBoundingClientRect();

//       window.scrollBy({
//         top: cardHeight * 2,
//         behavior: 'smooth',
//       });

//       if (!hasMore) {
//         Notify.failure(
//           'We are sorry, but you have reached the end of search results.'
//         );
//         loadMoreBtn.classList.add('is-hidden');
//       }
//     })
//     .catch(err => console.log(err));
// }

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
