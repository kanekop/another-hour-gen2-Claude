// public/js/aph-graph-demo.js

// DOM Elements
const aphGraphBar = document.getElementById('aphGraphBar');
const normalDurationSlider = document.getElementById('normal-duration-slider');
const normalDurationValueDisplay = document.getElementById('normal-duration-value-display');
const anotherHourDurationDisplay = document.getElementById('another-hour-duration-display');
const sliderRealTimeLabel = document.getElementById('slider-real-time-label');
const sliderRealTimeIndicator = document.querySelector('.slider-real-time-indicator');

// --- Utility Functions ---
function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hours ${minutes} minutes`;
}

function updateSliderDisplays(normalAphDayMinutes) {
    if (!normalDurationSlider || !anotherHourDurationDisplay || !sliderRealTimeLabel || !sliderRealTimeIndicator || !normalDurationValueDisplay) {
        console.error("Slider display elements not found");
        return;
    }

    normalDurationValueDisplay.textContent = formatDuration(normalAphDayMinutes);

    const totalRealMinutesInDay = 24 * 60;
    const aphDurationMinutes = totalRealMinutesInDay - normalAphDayMinutes;
    anotherHourDurationDisplay.textContent = `Another Hour Duration: ${formatDuration(aphDurationMinutes)}`;

    const realTimeHourEquivalent = Math.floor(normalAphDayMinutes / 60);
    const realTimeMinuteEquivalent = normalAphDayMinutes % 60;
    sliderRealTimeLabel.textContent = `${String(realTimeHourEquivalent).padStart(2, '0')}:${String(realTimeMinuteEquivalent).padStart(2, '0')}`;

    const sliderMin = parseInt(normalDurationSlider.min, 10);
    const sliderMax = parseInt(normalDurationSlider.max, 10);
    let thumbPositionRatio = 0; // Default to 0 if sliderMax is equal to sliderMin
    if (sliderMax - sliderMin !== 0) { // Prevent division by zero
        thumbPositionRatio = (normalAphDayMinutes - sliderMin) / (sliderMax - sliderMin);
    }


    if (sliderRealTimeIndicator) {
        sliderRealTimeIndicator.style.setProperty('--slider-thumb-position', `${thumbPositionRatio * 100}%`);
    }
    normalDurationSlider.style.setProperty('--slider-progress-percent', `${thumbPositionRatio * 100}%`);
}


// --- Graph Drawing Functions ---
function drawAphGraph(normalAphDayMinutes) {
    // console.log(`drawAphGraph called with normalAphDayMinutes: ${normalAphDayMinutes}`);
    if (!aphGraphBar) {
        console.error("APH graph bar element not found");
        return;
    }
    aphGraphBar.innerHTML = '';

    const totalRealMinutesInDay = 24 * 60;
    const aphDurationMinutes = totalRealMinutesInDay - normalAphDayMinutes;

    const normalColor = '#f0ad4e';
    const aphColor = '#d9534f';

    let normalPartPercent = (normalAphDayMinutes / totalRealMinutesInDay) * 100;
    let aphPartPercent = (aphDurationMinutes / totalRealMinutesInDay) * 100;

    if (normalAphDayMinutes <= 0) {
        normalPartPercent = 0;
        aphPartPercent = 100;
    } else if (aphDurationMinutes <= 0) {
        normalPartPercent = 100;
        aphPartPercent = 0;
    }
    if (normalPartPercent + aphPartPercent > 100.0001 || normalPartPercent + aphPartPercent < 99.9999) { // Handle floating point issues
         if (normalPartPercent > 0 && aphPartPercent > 0) aphPartPercent = 100 - normalPartPercent;
    }

    // 修正依頼1: オレンジブロックを先に描画 (flex-direction: column のため)
    if (normalPartPercent > 0) {
        const normalSegmentBlock = document.createElement('div');
        normalSegmentBlock.classList.add('bar-segment-block');
        normalSegmentBlock.style.height = `${normalPartPercent}%`;
        normalSegmentBlock.style.backgroundColor = normalColor;
        // 修正依頼1 & 3: ラベルを0から22の昇順で追加
        // CSSで .bar-segment-block に display:flex; flex-direction:column; を指定
        // CSSで .segment-hour-label に flex-grow:1; を指定して均等に高さを分配
        const numberOfLabelsInNormalPart = 24; // 0 to 22 // 23 to 24 金子修正
        for (let i = 0; i < numberOfLabelsInNormalPart; i++) {
            const labelDiv = document.createElement('div');
            labelDiv.classList.add('segment-hour-label');
            labelDiv.textContent = i;
            // CSS側で均等分配するため、JSでの個別高さ設定は不要 (flex-grow:1 があれば)
            normalSegmentBlock.appendChild(labelDiv);
        }
        aphGraphBar.appendChild(normalSegmentBlock);
    }

    // 修正依頼1: 赤ブロックを後に描画
    if (aphPartPercent > 0) {
        const aphSegmentBlock = document.createElement('div');
        aphSegmentBlock.classList.add('bar-segment-block');
        aphSegmentBlock.style.height = `${aphPartPercent}%`;
        aphSegmentBlock.style.backgroundColor = aphColor;
        aphSegmentBlock.textContent = 'Another Hour';
        aphSegmentBlock.style.display = 'flex';
        aphSegmentBlock.style.alignItems = 'center';
        aphSegmentBlock.style.justifyContent = 'center';
        const aphSingleHourPercent = (1/24) * 100 * 0.8;
        aphSegmentBlock.style.fontSize = aphPartPercent < aphSingleHourPercent ? '0.5em' : '0.7em';
        aphSegmentBlock.style.overflow = 'hidden';
        aphSegmentBlock.style.lineHeight = '1.1'; // Ensure text is visible
        aphGraphBar.appendChild(aphSegmentBlock);
    }

    updateAphAxisLabels(normalAphDayMinutes, totalRealMinutesInDay);
} // End of drawAphGraph function


// public/js/aph-graph-demo.js

// (他の部分は変更なし)
// public/js/aph-graph-demo.js

// (他の部分は変更なし)

// public/js/aph-graph-demo.js

// (drawAphGraph およびその他の関数は変更なし)
// public/js/aph-graph-demo.js

function updateAphAxisLabels(normalAphDayMinutes, totalRealMinutesInDay) {
    const aphAxisLabelContainer = document.querySelector('.aph-graph-container .axis-labels');
    if (!aphAxisLabelContainer) {
        console.error("APH Axis Label Container not found!");
        return;
    }
    aphAxisLabelContainer.innerHTML = ''; // Clear existing labels in APH axis

    const aphGraphContainer = document.querySelector('.aph-graph-container'); // APHグラフコンテナを取得
    // const graphArea = document.querySelector('.graph-area'); // graphArea はもう不要

    if (!aphGraphContainer) { // graphArea と realHoursGraphContainer のチェックも文脈に応じて調整
        console.error("APH graph container not found for axis label positioning.");
        return;
    }

    const normalPartPercent = (normalAphDayMinutes / totalRealMinutesInDay) * 100;
    const ah24PositionInGraphArea = normalPartPercent;

    // --- AH 24 Indicator Label (これは aphAxisLabelContainer 内なので変更なし) ---
    const ah24Label = document.createElement('div');
    ah24Label.classList.add('dynamic-aph-axis-label');
    ah24Label.textContent = 'AH 24';
    ah24Label.style.position = 'absolute';
    ah24Label.style.top = `${ah24PositionInGraphArea}%`;
    ah24Label.style.left = `calc(100% + 5px)`; // aphAxisLabelContainerの右外側
    ah24Label.style.transform = 'translateY(-50%)';
    ah24Label.style.color = '#d9534f';
    aphAxisLabelContainer.appendChild(ah24Label);

    // --- Horizontal Line (これを aphGraphContainer の子として追加) ---
    // 古い線を削除 (もしあれば) - 削除対象の親要素も変更
    const existingGlobalLine = aphGraphContainer.querySelector('.aph-start-indicator-line');
    if (existingGlobalLine) existingGlobalLine.remove();

    const globalLine = document.createElement('div');
    globalLine.classList.add('aph-start-indicator-line');
    globalLine.style.position = 'absolute';
    globalLine.style.top = `${ah24PositionInGraphArea}%`; // aphGraphContainer の高さに対するパーセンテージ
    globalLine.style.left = '0'; // aphGraphContainer の左端から開始
    globalLine.style.width = '100%'; // aphGraphContainer の全幅
    // globalLine.style.height = '2px'; // CSSで border-top を使うなら不要
    // globalLine.style.transform = 'translateY(-1px)'; // CSSで調整する方が良い場合も

    // aphGraphContainer.appendChild(globalLine); // axis-labels と同じレベルか、bar の上かなど検討
    // UXを考慮し、グラフバーのコンテナ(.aph-graph-container)直下、
    // ただし軸ラベル(.aph-axis-labels)よりは手前(DOM構造上次)か、
    // もしくは軸ラベルコンテナ(.aph-axis-labels)の子要素にするのが管理しやすいかもしれません。
    // ここでは、ひとまず aphGraphContainer の直下に追加し、CSSでz-indexを調整することを想定します。
    // もし .aph-axis-labels の中に描画したいなら、aphAxisLabelContainer.appendChild(globalLine); とします。
    // 今回は、APHグラフバーの上端を示す線なので、.aph-graph-container の子要素で、.graph-bar と同じレベルが良いでしょう。
    // ただし、.aph-graph-container は display:flex, flex-direction:column なので、
    // 単純に追加するとレイアウトが崩れる可能性があります。
    // そのため、.aph-graph-container の中の .graph-bar の兄弟としてではなく、
    // .aph-graph-container 自体を基準に絶対配置するのが適切です。
    // .aph-graph-container に position: relative が必要です（これは既に .graph-bar-container に設定されています）。

    aphGraphContainer.insertBefore(globalLine, aphGraphContainer.firstChild); // .aph-graph-container の最初の子要素として挿入

    // --- Labels for AH 0, 6, 12, 18 (within aphAxisLabelContainer) ---
    const aphMilestones = [
        { aphHour: 0, text: "AH 0" },
        { aphHour: 6, text: "AH 6" },
        { aphHour: 12, text: "AH 12" },
        { aphHour: 18, text: "AH 18" },
    ];

    aphMilestones.forEach(milestone => {
        let percentTop;
        if (milestone.aphHour === 0) {
            percentTop = 0;
        } else {
            if (normalAphDayMinutes === 0) { // Normal part is 0
                return; // AH 6, 12, 18 は表示しない
            }
            const relativePositionInConceptualNormalAph = milestone.aphHour / 23;
            const correspondingRealMinutes = relativePositionInConceptualNormalAph * normalAphDayMinutes;
            percentTop = (correspondingRealMinutes / totalRealMinutesInDay) * 100;

            if (percentTop > normalPartPercent + 0.1) {
                return;
            }
        }

        const labelElement = document.createElement('div');
        labelElement.classList.add('dynamic-aph-axis-label');
        labelElement.textContent = milestone.text;
        labelElement.style.position = 'absolute';
        labelElement.style.top = `${percentTop}%`;
        labelElement.style.left = `calc(100% + 5px)`;
        labelElement.style.transform = 'translateY(-50%)';
        aphAxisLabelContainer.appendChild(labelElement);
    });
}
// End of updateAphAxisLabels function

// (initialize 関数は変更なし)
document.addEventListener('DOMContentLoaded', initialize);


function initialize() {
    const initialNormalAphDayMinutes = parseInt(normalDurationSlider.value, 10);
    updateSliderDisplays(initialNormalAphDayMinutes);
    drawAphGraph(initialNormalAphDayMinutes); // Initial draw

    normalDurationSlider.addEventListener('input', (event) => {
        const currentNormalAphDayMinutes = parseInt(event.target.value, 10);
        updateSliderDisplays(currentNormalAphDayMinutes);
        drawAphGraph(currentNormalAphDayMinutes); // Redraw on slider input
    });

    window.addEventListener('resize', () => {
        // Clear existing global line before redrawing
        const graphAreaForLine = document.querySelector('.graph-area');
        const existingLine = graphAreaForLine.querySelector('.aph-start-indicator-line');
        if (existingLine) existingLine.remove();
        drawAphGraph(parseInt(normalDurationSlider.value, 10));
    });
    console.log("Event listeners initialized.");
}// End of initialize function

document.addEventListener('DOMContentLoaded', initialize);