// Frozen using development images only; evaluated separately on reserved validation.
export const localRecognitionPolicy=Object.freeze({
 version:2,engine:'fashion-detr-v1',modelId:'threadline/fashion-detr-v1',
 sourceModel:'yainage90/fashion-object-detection',revision:'fb0a4ff27adfe56500ab4d36e2586436eb1d2979',
 sourceSHA256:'01f78edc0c0e3abfcf8b09555d04ab5a43216a501bf24559ce5619673c4ce824',
 threshold:.15,nmsIoU:.65,minimumSpatialRange:2,shortestEdge:800,longestEdge:1333,maxItems:20,
 labels:['bag','bottom','dress','hat','outer','shoes','top'],dtype:'q8'
});
