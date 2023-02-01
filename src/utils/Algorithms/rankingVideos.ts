import { Video, VideoSchema } from './../../videos/video.schema';
import { videos } from './video.data';

interface ResultVideo {
    id: string;
    title: string;
    point: number;
}

type Result = Array<ResultVideo>;
type Videos = Array<Video>;
const rankingVideo: (videos: Array<Video>, word: string) => Result = (
    videos: Array<Video>,
    word: string,
) => {
    //kmp algorithm
    const pattern = (word: string) => {
        const result: Array<number> = [];
        let i = 0;
        let j = 1;
        result[0] = 0;
        while (j < word.length) {
            if (word[i] === word[j]) {
                result[j] = i + 1;
                i++;
                j++;
            } else {
                if (i === 0) {
                    result[j] = 0;
                    j++;
                } else {
                    i = result[i - 1];
                }
            }
        }
        return result;
    };
    const kmp = (word: string, text: string) => {
        const result: Array<number> = [];
        const pat = pattern(word);
        let i = 0;
        let j = 0;
        while (j < text.length) {
            if (word[i] === text[j]) {
                if (i === word.length - 1) {
                    result.push(j - i);
                    i = pat[i];
                } else {
                    i++;
                }
                j++;
            } else {
                if (i === 0) {
                    j++;
                } else {
                    i = pat[i - 1];
                }
            }
        }
        return result;
    };

    const result: Result = [];
    // check if the word is in the title
    videos.forEach(video => {
        const point = kmp(word, video.title).length;
        result.push({
            id: video._id,
            title: video.title,
            point: point,
        });
    });
    // sort the result by point
    result.sort((a, b) => b.point - a.point);
    return result;
};

rankingVideo(videos, 'a');

export default rankingVideo;
