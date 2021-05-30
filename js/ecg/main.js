function display() {
    /**
     * Displays the current stage.
     */

    let root = document.getElementById("app");

    // display title and description
    document.getElementById("title").innerText = $stage.getTitle();
    let description = document.getElementById("description");
    description.innerText = $stage.getDescription();

    // add button for next stage to description
    if (!$stage.lastStage()) {
        let next = document.createElement("button");
        next.classList.add("btn");
        next.classList.add("next-btn");
        next.innerText = "Next ›";
        next.onclick = nextStage;

        description.appendChild(next);
    }

    // get the total number of samples
    let num_samples = $stage.sampleLength();

    // build default x-axis
    let x_axis = Array(num_samples);
    for (let i = 0; i < num_samples; i++) {
        x_axis[i] = i;
    }

    // turn samples into plotting format
    let data = [];
    let waveforms = $stage.getWaveforms();
    let waveform_colors = $stage.getWaveformColors();
    for (let i = 0; i < waveforms.length; i++) {
        let waveform = waveforms[i];
        let color = waveform_colors[i];
        for (let j = 0; j < waveform.length; j++) {
            let x1 = waveform[j][0];
            let x2 = waveform[j][1] + 1;
            let samples = waveform[j][2];
            let samples_xaxis = x_axis.slice(x1, x2);
            data.push({
                x: samples_xaxis,
                y: samples,
                type: "scatter",
                hoverinfo: "skip",
                marker: {
                    color: color
                }
            });
        }
    }

    // set the default zoom level to 1.5 seconds
    let view_duration = 1.5;
    let frequency = $stage.sampleFrequency();
    let view_samples = view_duration * frequency;

    // create vertical lines to show boundaries
    let lines = [];
    let y_range = $stage.getYDimensions();
    let boundaries = $stage.getBoundaries();
    let boundary_colors = $stage.getBoundaryColors();
    for (let i = 0; i < boundaries.length; i++) {
        let boundary = boundaries[i];
        let color = boundary_colors[i];
        for (let j = 0; j < boundary.length; j++) {
            let x = boundary[j];
            lines.push({
                type: 'line',
                xref: 'x',
                yref: 'paper',
                x0: x,
                y0: 0,
                x1: x,
                y1: 1,
                line: {
                    color: color
                }
            });
        }
    }

    // create horizontal lines to underline segments
    let underlines = $stage.getUnderlines();
    let underline_colors = $stage.getUnderlineColors();
    for (let i = 0; i < underlines.length; i++) {
        let underline = underlines[i];
        let color = underline_colors[i];
        for (let j = 1; j < underline.length; j += 2) {
            let x1 = underline[j - 1];
            let x2 = underline[j];
            // bottom line
            lines.push({
                type: 'line',
                xref: 'x',
                yref: 'y',
                x0: x1,
                y0: y_range[1],
                x1: x2,
                y1: y_range[1],
                line: {
                    color: color
                }
            });
            // top line
            lines.push({
                type: 'line',
                xref: 'x',
                yref: 'y',
                x0: x1,
                y0: y_range[0],
                x1: x2,
                y1: y_range[0],
                line: {
                    color: color
                }
            });
        }
    }

    // create horizontal lines to represent thresholds
    let thresholds = $stage.getThresholds();
    let threshold_colors = $stage.getThresholdColors();
    for (let i = 0; i < thresholds.length; i++) {
        let threshold = thresholds[i];
        let color = threshold_colors[i];
        for (let j = 0; j < threshold.length; j++) {
            let x1 = threshold[j][0];
            let x2 = threshold[j][1];
            let y = threshold[j][2];
            lines.push({
                type: 'line',
                xref: 'x',
                yref: 'y',
                x0: x1,
                y0: y,
                x1: x2,
                y1: y,
                line: {
                    color: color,
                    dash: 'dash'
                }
            });
        }
    }

    // get start and end of samples to be viewed
    let view_start = $stage.getViewBoundaries()[0];
    let view_end = $stage.getViewBoundaries()[1];

    // graph settings
    let layout = {
        shapes: lines,
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {l: 0, r: 15, t: 10, b: 10},
        xaxis: {
            showgrid: false,
            zeroline: false,
            fixedrange: true,
            showticklabels: false,
            range: [view_start, view_samples],
            rangeslider: {
                range: [view_start, view_end]
            }
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            visible: false,
            fixedrange: true
        },
        annotations: []
    };
    let config = {
        displayModeBar: false,
        responsive: true
    };

    // add annotations to graph layout
    let annotations = $stage.getAnnotation();
    for (let i = 0; i < annotations.length; i++) {
        let annotation = annotations[i];
        for (let j = 0; j < annotation.length; j++) {
            let x = annotation[j][0];
            let y = y_range[1];
            let text = annotation[j][1];
            layout["annotations"].push({
                x: x,
                y: y,
                text: text,
                showarrow: false,
                font: {
                    color: "black",
                    size: 15
                }
            });
        }
    }

    Plotly.newPlot(root, data, layout, config);
}

function nextStage() {
    /**
     * Progress to next stage if one exists.
     */

    $stage.nextStage();
    display($stage);
    if ($stage.lastStage()) {
        let forward_button = document.getElementById("forward-btn");
        forward_button.disabled = true;
    } else if (!$stage.firstStage()) {
        let back_button = document.getElementById("back-btn");
        back_button.disabled = false;
    }
}

function prevStage() {
    /**
     * Backup to previous stage if one exists.
     */

    $stage.prevStage();
    display($stage);
    if ($stage.firstStage()) {
        let back_button = document.getElementById("back-btn");
        back_button.disabled = true;
    } else if (!$stage.lastStage()) {
        let forward_button = document.getElementById("forward-btn");
        forward_button.disabled = false;
    }
}

function createArrowEventListeners() {
    /**
     * Allow arrow keys to be used for stage control.
     */

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") {
            nextStage();
        } else if (e.key === "ArrowLeft") {
            prevStage();
        }
    });
}

function sampleChange() {
    /**
     * Updates samples when the patient I.D. is changed.
     */

    let select = document.getElementById("sample");
    $stage.setSample(select.value);
    display();

    // toggles disabled to prevent arrow keys from changing sample
    select.disabled = true;
    select.disabled = false;
}

$stage = new Stages(document.getElementById("sample").value);
display();
createArrowEventListeners();
