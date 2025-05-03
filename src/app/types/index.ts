export interface Podcast {
  _id: string;
  name: string;
  img: string;
  uNm: string;
  isSelected?: boolean;
}

export interface UserSelectedPodcasts {
  userId: string;
  selectedPodcasts: Podcast[];
}
