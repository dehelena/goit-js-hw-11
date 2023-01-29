import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '33097272-5cfe3e3a455a7cd5afa001a4b';
  #totalResults = 0;

  constructor() {
    this.query = null;
    this.page = null;
  }

  fetchPhotos() {
    const searchParams = {
      params: {
        q: this.query,
        page: this.page,
        key: PixabayAPI.API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    };

    return axios.get(`${PixabayAPI.BASE_URL}`, searchParams);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  setTotal(total) {
    this.#totalResults = total;
  }

  hasMorePhotos() {
    return this.page < Math.ceil(this.#totalResults / 40);
  }
}
