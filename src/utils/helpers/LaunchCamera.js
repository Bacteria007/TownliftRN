const { launchImageLibrary } = require("react-native-image-picker");

export async function  SelectImage (setState) {
    const options = {
        maxWidth: 1080,
        maxHeight: 1080,
    };
    launchImageLibrary(options, Response => {
        if (Response.didCancel) {
            console.log('Image not selected');
        } else if (Response.error) {
            console.log('ImagePicker Error: ', Response.error);
        } else {
            const imageMessage = { uri: Response.assets[0].uri, name: Response.assets[0].fileName, type: Response.assets[0].type };
            setState(imageMessage);
        }
    })
} 