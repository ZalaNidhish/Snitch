// Turns any backend / network error into one readable message.
// Handles: { message }, { message, errors: [{ msg | message }] } (auth validators)
// and { message, errors: { errors: [{ msg }] } } (product validators send the express-validator Result).
export const getErrorMessage = (error, fallback = "Something went wrong") => {
    const data = error?.response?.data

    if (!error?.response) {
        return error?.code === "ERR_NETWORK"
            ? "Cannot reach the server. Please try again."
            : fallback
    }

    // e.g. an HTML error page (multer errors such as "File too large")
    if (!data || typeof data === "string") return fallback

    const list = Array.isArray(data.errors) ? data.errors : data.errors?.errors
    const first = Array.isArray(list) ? list[0] : null

    return first?.msg || first?.message || data.message || fallback
}
