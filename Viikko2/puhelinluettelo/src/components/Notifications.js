const Notification = ({ message, boolean }) => {
    if (message === null) {
        return null
    }

    if (boolean)
        return (
            <div className="error">
                {message}
            </div>
        )

    if (!boolean)
        return (
            <div className="correct">
                {message}
            </div>
        )
}

export default Notification