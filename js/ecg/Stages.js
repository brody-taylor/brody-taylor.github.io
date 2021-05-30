class Stages {
    /**
     * Creates each stage using the patient waveform data.
     */

    constructor(pat_id) {
        this.data = getData();
        this.pat_id = pat_id;
        this.stage = 0;
        this.stages = this._getUpdatedStages()
        this.num_stages = Object.keys(this.stages).length;
    }

    getViewBoundaries() { return this.data[this.pat_id]["display"]; }

    getYDimensions() { return this.data[this.pat_id]["y_dim"]; }

    sampleLength() { return this.data[this.pat_id]["num_samples"]; }

    sampleFrequency() { return this.data[this.pat_id]["frequency"]; }

    setSample(sample) {
        this.pat_id = sample;
        this.stages = this._getUpdatedStages();
    }

    getStage() { return this.stage; }

    nextStage() {
        if (this.stage < this.num_stages-1) {
            this.stage ++;
        }
    }

    prevStage() {
        if (this.stage > 0) {
            this.stage --;
        }
    }

    lastStage() { return this.stage === this.num_stages-1; }

    firstStage() { return this.stage === 0; }

    getWaveforms() { return this.stages[this.getStage()]["waveforms"]; }

    getWaveformColors() { return this.stages[this.getStage()]["waveform_colors"]; }

    getBoundaries() { return this.stages[this.getStage()]["boundaries"]; }

    getBoundaryColors() { return this.stages[this.getStage()]["boundary_colors"]; }

    getUnderlines() { return this.stages[this.getStage()]["underlines"]; }

    getUnderlineColors() { return this.stages[this.getStage()]["underline_colors"]; }

    getThresholds() { return this.stages[this.getStage()]["thresholds"]; }

    getThresholdColors() { return this.stages[this.getStage()]["threshold_colors"]; }

    getTitle() { return this.stages[this.getStage()]["title"]; }

    getDescription() { return this.stages[this.getStage()]["description"]; }

    getAnnotation() { return this.stages[this.getStage()]["annotation"]; }

    _getUpdatedStages() {
        return {
            0: {
                title: "Introduction",
                description: "The Electrocardiograph (ECG) is a graph of the heart's electrical activity. " +
                    "There are three main components that repeat through an ECG with each heartbeat:\n" +
                    "- The QRS complex, made up of a Q, R, and S wave (underlined in black).\n" +
                    "- The T-wave, which occurs after the QRS complex (underlined in blue).\n" +
                    "- The P-wave, which occurs prior to the QRS complex (underlined in orange).\n" +
                    "Interpretation of the ECG requires precise measurements of the components. " +
                    "However, some of these measurements are difficult to do by hand, and so assistive software is required to make accurate and time-efficient measurements. " +
                    "The purpose of this project is to build an application that automates measurement of the P-wave's terminal component, using Python. " +
                    "The terminal component is the negative deflection that is sometimes present on a P-wave, and there is a growing understanding that its size is associated with stroke. " +
                    "To measure this terminal component, the program must first find the P-wave boundaries, determine if the terminal component is present, and then isolate the terminal component for measurement. " +
                    "The following describes the steps taken by the application and how they were implemented.",
                waveforms: [this.data[this.pat_id]["filtered"]],
                waveform_colors: ["red"],
                boundaries: [],
                boundary_colors: [],
                thresholds: [],
                threshold_colors: [],
                underlines: [this.data[this.pat_id]["qrs"], this.data[this.pat_id]["twaves"], this.data[this.pat_id]["pwaves"]],
                underline_colors: ["black", "blue", "orange"],
                annotation: []
            },

            1: {
                title: "Filtering",
                description: "The first step to successful digital signal processing is filtering noise from the waveform. " +
                    "Noise can originate from a variety of sources, corrupting the signal with interference (shown in blue). " +
                    "The program uses a bandpass filter to recover the original signal and improve accuracy. " +
                    "The bandpass filter is a combination of a lowpass and highpass filter, implemented using Python's SciPy module. " +
                    "A lowpass filter (using a Savitzky-Golay filter) is applied first to smooth the signal. " +
                    "A highpass filter (using a Butterworth filter) is next applied to remove baseline wander, ensuring that the signal does not trend upward or downward.",
                waveforms: [this.data[this.pat_id]["filtered"], this.data[this.pat_id]["samples"]],
                waveform_colors: ["red", "blue"],
                boundaries: [],
                boundary_colors: [],
                thresholds: [],
                threshold_colors: [],
                underlines: [],
                underline_colors: [],
                annotation: []
            },

            2: {
                title: "QRS Detection",
                description: "The P-wave exists in the region between the T-wave end point and the start of the following QRS complex. " +
                    "To isolate this region, QRS complexes must first be detected so their start and end point can be determined. "+
                    "The QRS complexes are detected as being a wide region of high absolute slope. " +
                    "This detection method is the most robust against false-positives and false-negatives. " +
                    "First, slope information is gathered by deriving the waveform (shown in green).",
                waveforms: [this.data[this.pat_id]["filtered"], this.data[this.pat_id]["derived"]],
                waveform_colors: ["red", "green"],
                boundaries: [],
                boundary_colors: [],
                thresholds: [],
                threshold_colors: [],
                underlines: [],
                underline_colors: [],
                annotation: []
            },

            3: {
                title: "QRS Detection",
                description: "Next, these slope values are squared to absolute the values and differentiate the larger slope values in the QRS complexes from the smaller slope values in the T and P waves (shown in green). " +
                    "An adaptive threshold moves along the squared derivative, detecting a QRS when the slope meets the threshold line (shown as dotted blue). " +
                    "This threshold starts as 80% of the max value from the first two seconds of the squared derivative. " +
                    "For each detection, the local slope maximum adjusts the threshold by either lowering or raising it, depending on if the maximum is smaller or larger, respectively. "+
                    "The refractory period is a physiological feature where 200 ms must pass after a QRS before another can occur. " +
                    "To incorporate this feature, the program will skip 200 ms forward after a detection to search for the next. " +
                    "To help prevent missed detections, a backtracking method with a lowered threshold is initiated if 1.8x the average duration between complexes has passed. " +
                    "The backtracking method uses 50% of the current threshold (shown as dotted light blue, if used) in an attempt to locate a missed QRS complex. " +
                    "This is a trade-off between risking a false-positive with the lowered threshold and trying to prevent missed detections.",
                waveforms: [this.data[this.pat_id]["filtered"], this.data[this.pat_id]["squared"]],
                waveform_colors: ["red", "green"],
                boundaries: [],
                boundary_colors: [],
                thresholds: [this.data[this.pat_id]["qrs_threshold"], this.data[this.pat_id]["qrs_lowered_threshold"]],
                threshold_colors: ["blue", "lightblue"],
                underlines: [],
                underline_colors: [],
                annotation: []
            },

            4: {
                title: "QRS Boundary",
                description: "Once a QRS is detected, its start and end point must be determined (indicated by vertical black lines). " +
                    "A moving window average of the previously used squared derivative allows fluctuations in slope to be grouped together (shown in green). " +
                    "More specifically, each point is made equal to the sum of the points from a fixed distance (the window) prior to it. " +
                    "This means that as the window iterates through the QRS complex, its sum will increase. " +
                    "When it reaches the end of the QRS, it will cease increasing and begin to fall once the window is no longer big enough to sum the entirety of the QRS. " +
                    "With this understanding, the QRS end point can be defined as the peak of the moving window average at each detection. " +
                    "Similarly, the local minimum correlates to the start point, since the moving window average does not increase until it reaches the beginning of the QRS complex. " +
                    "However, the Q portion of the QRS complex is usually very minor and can be negligible in the moving average. " +
                    "Because of this, it is assumed that the local min represents the beginning of the R-wave. " +
                    "The start point can then be defined as approx. 40 ms from the beginning of the R-wave, due to the Q-wave having a very consistent duration.",
                waveforms: [this.data[this.pat_id]["filtered"], this.data[this.pat_id]["averaged"]],
                waveform_colors: ["red", "green"],
                boundaries: [this.data[this.pat_id]["qrs"]],
                boundary_colors: ["black"],
                thresholds: [],
                threshold_colors: [],
                underlines: [],
                underline_colors: [],
                annotation: []
            },

            5: {
                title: "T-wave Boundary",
                description: "With the QRS boundaries defined (indicated by vertical black lines), the program moves onto the T-wave. " +
                    "Because the goal is to isolate the region between the T-wave end point and the start of the following QRS complex, the program does not need to define the T-wave start point. " +
                    "It first defines a search window as a function of the heart rate to help prevent P-waves from being mistaken as T-waves. " +
                    "The program then uses the derivative (shown in green) to find slope peaks within this window. " +
                    "The right-most slope peak is used to set a threshold and is then iterated forward from until the slope decreases past the threshold or the end of the window is reached, defining the end point.",
                waveforms: [this.data[this.pat_id]["filtered"], this.data[this.pat_id]["twave_derived"]],
                waveform_colors: ["red", "green"],
                boundaries: [this.data[this.pat_id]["twaves"], this.data[this.pat_id]["qrs"]],
                boundary_colors: ["blue", "black"],
                thresholds: [],
                threshold_colors: [],
                underlines: [],
                underline_colors: [],
                annotation: []
            },

            6: {
                title: "P-wave Boundary",
                description: "The distance between the start of the P-wave and the beginning of the QRS should be at most 220 ms. " +
                    "Because of this feature, the search window for the P-wave can be decreased if the distance from the T-wave end and QRS start is greater than 220 ms. " +
                    "Within this window (derived in green), the greatest negative slope value should indicate the downward component of the P-wave (indicated by a black vertical line). " +
                    "In some cases no P-wave is present, this is determined if the maximum negative slope is less than 5% of the maximum slope present in the associated QRS complex. " +
                    "Similarly to the T-wave, the start and end point can be found by setting a threshold relative to the first and last slope peak, respectively. " +
                    "The first slope peak will always be the maximum positive slope prior to the negative peak (indicated by a blue vertical line). " +
                    "However, the last slope peak is dependent on if the P-wave has a terminal component. " +
                    "The terminal component is said to be present if there is a comparable positive slope peak occurring after the negative peak (a second blue line if present), if not then the negative peak is the last slope peak and it is used to set the end point threshold. " +
                    "The start and end point can finally be determined by backward and forward tracking from the first and last slope peak, until the respective threshold is met (indicated by orange vertical lines).",
                waveforms: [this.data[this.pat_id]["filtered"], this.data[this.pat_id]["pwave_derived"]],
                waveform_colors: ["red", "green"],
                boundaries: [this.data[this.pat_id]["pwave_last_peaks"], this.data[this.pat_id]["pwave_neg_peaks"], this.data[this.pat_id]["pwave_first_peaks"], this.data[this.pat_id]["pwaves"]],
                boundary_colors: ["blue", "black", "blue", "orange"],
                thresholds: [],
                threshold_colors: [],
                underlines: [],
                underline_colors: [],
                annotation: []
            },

            7: {
                title: "Isolating and Measuring Terminal Component",
                description: "If the previous step had determined there is no terminal component, then there is nothing to be measured and the program has finished. " +
                    "If there is a terminal component, its start point is the point of inflection, also defined as the peak negative slope. " +
                    "Its end point is simply the end of the P-wave. " +
                    "From here, the size of the terminal component can be calculated as its duration multiplied by its depth (annotated at bottom if terminal component is present).",
                waveforms: [this.data[this.pat_id]["filtered"]],
                waveform_colors: ["red"],
                boundaries: [this.data[this.pat_id]["pwave_term_components"]],
                boundary_colors: ["orange"],
                thresholds: [],
                threshold_colors: [],
                underlines: [],
                underline_colors: [],
                annotation: [this.data[this.pat_id]["pwave_term_forces"]]
            }
        };
    }
}