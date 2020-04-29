export function convertSnaps<T>(snaps) {
    return <T[]>snaps.map(snap => {
        return {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data() as {}
        };
    });
}

// this is used as a common function by the service to query the db getting the payload with id