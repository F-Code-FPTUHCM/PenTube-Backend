import { Injectable } from '@nestjs/common';

@Injectable()
export class KMP {
    pattern(word: string): Array<number> {
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
    }

    process(word: string, text: string): number {
        const result: Array<number> = [];
        let maxLength = 0;
        const pat = this.pattern(word);
        let i = 0;
        let j = 0;
        while (j < text.length) {
            if (word[i] === text[j]) {
                maxLength = Math.max(maxLength, i + 1);
                if (i === word.length - 1) {
                    i = pat[i];
                } else {
                    i++;
                }
                j++;
            } else {
                maxLength = Math.max(maxLength, i);
                if (i === 0) {
                    j++;
                } else {
                    i = pat[i - 1];
                }
            }
        }
        return maxLength;
    }
}
