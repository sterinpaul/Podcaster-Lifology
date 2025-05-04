export interface Podcast {
  _id: string;
  name: string;
  img: string;
  title: string;
  isSelected?: boolean;
}

export interface UserSelectedPodcasts {
  userId: string;
  selectedPodcasts: Podcast[];
}
