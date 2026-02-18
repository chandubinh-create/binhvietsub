
export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  time?: string;
  quality?: string;
  lang?: string;
  episode_current?: string;
}

export interface MovieDetail extends Movie {
  content: string;
  type: 'movie' | 'series';
  status: string;
  trailer_url: string;
  actor: string[];
  director: string[];
  category: { name: string; slug: string }[];
  country: { name: string; slug: string }[];
  episodes: {
    server_name: string;
    server_data: {
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }[];
  }[];
}

export interface ApiResponse<T> {
  status: string;
  items: T[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface HistoryItem {
  slug: string;
  name: string;
  poster: string;
  episodeName: string;
  episodeSlug: string;
  timestamp: number;
  progress: number; // seconds
  duration: number; // total duration
}

export interface Comment {
  id: string;
  movieSlug: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
}
