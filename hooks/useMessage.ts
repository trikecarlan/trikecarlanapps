import { Alert } from "react-native";

export default function useMessage(errorMessages: string[], title: string) {

    return (Alert.alert(
        title,
        errorMessages.join(",\n"),
        [
            { text: "OK" }
        ],
        { cancelable: false }
    ))
}