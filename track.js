const trackTypes = {
    "Märklin-C": [
        { model: "24236", length: 236.1 },
        { model: "24229", length: 229.3 },
        { model: "24188", length: 188.3 },
        { model: "24172", length: 171.7 },
        { model: "24094", length: 94.2  },
        { model: "24077", length: 77.5  },
        { model: "24071", length: 70.8  },
        { model: "24064", length: 64.3  }
    ],
    "Märklin-M": [
        { model: "5106", length: 180 },
        { model: "5107", length: 90  },
        { model: "5108", length: 45  },
        { model: "5109", length: 33.5 },
        { model: "5110", length: 22.5 },
        { model: "5129", length: 70 },
        { model: "5211", length: 98 },
        { model: "5210", length: 16 },
        { model: "5208", length: 8  },
    ],
    "Märklin-K": [
        { model: "2200", length: 180   },
        { model: "2201", length: 90    },
        { model: "2202", length: 45    },
        { model: "2203", length: 30    },
        { model: "2204", length: 22.4  },
        { model: "2205", length: 900   },
        { model: "2206", length: 168.9 },
        { model: "2207", length: 156   },
        { model: "2208", length: 35.1  },
        { model: "2209", length: 217.9 }
    ],
    "Märklin-Z": [
        { model: "8500", length: 110    },
        { model: "8503", length: 55     },
        { model: "8504", length: 25     },
        { model: "8506", length: 108.6  },
        { model: "8507", length: 112.8  },
        { model: "85051", length: 220  },
    ],
    "Märklin-1": [
        { model: "59051", length: 59.1 },
        { model: "59052", length: 79   },
        { model: "59053", length: 100  },
        { model: "59054", length: 116  },
        { model: "59055", length: 150  },
        { model: "59056", length: 152.2},
        { model: "59057", length: 200  },
        { model: "59058", length: 300  },
        { model: "59059", length: 600  },
        { model: "59061", length: 900  }
    ],
    "Fleischmann-HO": [
        { model: "6101", length: 200  },
        { model: "6102", length: 105  },
        { model: "6103", length: 100  },
        { model: "6106", length: 800  },
        { model: "6107", length:  10  },
    ]
};

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