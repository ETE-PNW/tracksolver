const trackTypes = require('./trackTypes').models;
//The maximum number of solutions to be returned
const MAX_SOLUTIONS = 150;

exports.getTrackTypes = () => {
    return Object.keys(trackTypes);
};

exports.getTracks = () => {
    return trackTypes;
};

exports.findTrackCombinations = (trackModel, tracksToUse, totalLength, tolerance, maxSolutions = MAX_SOLUTIONS) => {
    let tracks = trackTypes[trackModel].sort((a, b) => a.length < b.length ? 1 : -1); //This might not be needed

    if(tracksToUse && tracksToUse.length > 0){
        tracks = tracks.filter((track) => tracksToUse.includes(track.model));
    }

    const solutions = [];

    // Recursive function to find all combinations
    function backtrack(combination, startIndex, currentLength) {
        
        //We limit the number of solutions to 150 for now...
        if(solutions.length > maxSolutions) return;

        const error = Math.abs(totalLength - currentLength);

        // If within error tolerance, add to solutions
        if (error <= tolerance) {
            const detailedTracks = combination.map((count, index) => ({
                model: tracks[index].model,
                count: count,
                length: tracks[index].length // Add length of each track type
            })).filter(track => track.count > 0); // Filter out tracks that are not used

            const totalLength = detailedTracks.reduce((sum, track) => sum + (track.count * track.length), 0); // Compute total length for the solution
            const totalTracks = detailedTracks.reduce((sum, track) => sum + track.count, 0); // Compute total number of tracks for the solution
            solutions.push({
                error: Number(error.toFixed(1)),
                length: totalLength, // Add total length for this combination
                tracks: detailedTracks,
                totalTracks: totalTracks
            });
        }

        // If current length exceeds or equals the total length (within tolerance), stop adding more tracks
        if (currentLength >= totalLength) {
            return;
        }

        // Try adding more of each track
        for (let i = startIndex; i < tracks.length; i++) {
            combination[i]++; // Add one track of this type
            backtrack(combination.slice(), i, currentLength + tracks[i].length); // Recursive call
            combination[i]--; // Backtrack, remove the track
        }
    }

    // Start with an empty combination and 0 current length
    backtrack(new Array(tracks.length).fill(0), 0, 0);

    return solutions;
}