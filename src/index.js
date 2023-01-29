import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './pixabay-api';
import { galleryMarkup } from './galleryMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a');

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const pixabayAPI = new PixabayAPI();

function onFormSubmit(e) {
  e.preventDefault();
  pixabayAPI.query = e.target.elements.searchQuery.value.trim();
  pixabayAPI.resetPage();

  pixabayAPI
    .fetchPhotos()
    .then(response => {
      const {
        data: { hits, totalHits },
      } = response;
      if (!pixabayAPI.query || hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        galleryEl.innerHTML = '';
        e.target.reset();
        loadMoreBtn.classList.add('is-hidden');
        return;
      }

      Notify.success(`Hooray! We found ${totalHits} images.`);
      galleryEl.innerHTML = galleryMarkup(hits);
      loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(err => console.log(err));
}

function onLoadMoreBtnClick(e) {
  pixabayAPI.incrementPage();

  pixabayAPI
    .fetchPhotos()
    .then(response => {
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
    })
    .catch(err => console.log(err));
}

// function onGalleryClick(e) {
//   e.preventDefault();
// }

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
// galleryEl.addEventListener('click', onGalleryClick);
