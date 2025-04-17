export default function useImageDownloader() {
    const downloadImage = (imageUrl, fileName = 'image') => {
        let wordToReplace = "http";
        let replacementWord = "https";

        let modifiedString = imageUrl.replace(new RegExp(wordToReplace, "gi"), replacementWord);

        const link = document.createElement('a');
        link.href = modifiedString;
        link.download = fileName;

        // Add the link to the DOM and trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        downloadImage,
    };
}
