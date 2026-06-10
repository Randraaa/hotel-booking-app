export type Review = {
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  rating: number;
  reviewsCount?: number;
  tag?: string;
  galleryImages: string[];
  specifications: {
    size: string;
    bed: string;
    view: string;
  };
  reviews: Review[];
};
