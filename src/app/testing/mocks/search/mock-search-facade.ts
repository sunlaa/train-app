import { SearchRequest } from '@/core/models/search.model';
import { of } from 'rxjs';

export default class MockSearchFacade {
  state$ = of();

  tickets$ = of();

  status$ = of();

  error$ = of();

  isLoading$ = of();

  search(params: SearchRequest) {
    return params;
  }

  resetResults() {}
}
