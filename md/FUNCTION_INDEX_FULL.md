# Full Function Index


<!-- DOC_SYNC_START -->
> Doc sync: `2026-02-24`
> Full technical audit references:
> - [`COMMIT_HISTORY_FULL.md`](COMMIT_HISTORY_FULL.md)
> - [`FUNCTION_INDEX_FULL.md`](FUNCTION_INDEX_FULL.md)
> - [`LANGUAGE_STACK_FULL.md`](LANGUAGE_STACK_FULL.md)
<!-- DOC_SYNC_END -->
Updated: `2026-02-24`

- JavaScript named functions detected: `597`
- Python functions/methods detected: `11`

> Extraction mode: static scan (AST for Python, regex-based for JavaScript).

## Python Functions and Methods

### `codebreakdown.py` (4)
- `detect_category` - line `33` - `def`
- `count_nonempty_lines` - line `36` - `def`
- `iter_files` - line `39` - `def`
- `main` - line `45` - `def`

### `codeextractor.py` (2)
- `is_ignored_path` - line `5` - `def`
- `combine_code` - line `14` - `def`

### `scripts/video_to_table.py` (5)
- `parse_args` - line `12` - `def`
- `encode_bw_hex_bitset` - line `66` - `def`
- `encode_gray_hex_nibbles` - line `83` - `def`
- `convert_video` - line `91` - `def`
- `main` - line `176` - `def`

## JavaScript Functions

### `chemistry-illustrated-toggles.jsx` (9)
- `ToggleSwitch` - line `2`
- `handleToggle` - line `5`
- `handleKeyDown` - line `9`
- `LaboratoryScene` - line `48`
- `PeriodicScene` - line `96`
- `ReactionScene` - line `168`
- `MolecularScene` - line `206`
- `DistillationScene` - line `235`
- `CrystallizationScene` - line `272`

### `electron-app/electron/main.js` (9)
- `attach` - line `19`
- `detach` - line `23`
- `reset` - line `24`
- `getAppRootCandidates` - line `43`
- `resolveAppRoot` - line `59`
- `createWindow` - line `90`
- `createTray` - line `189`
- `updateTrayMenu` - line `221`
- `showNotification` - line `292`

### `electron-app/electron/wallpaper-api.js` (2)
- `setAsWallpaper` - line `14`
- `setAsWallpaperDirect` - line `81`

### `electron-app/electron/wallpaper-linux.js` (9)
- `isWaylandSession` - line `2`
- `hasBinary` - line `6`
- `getWindowIdHex` - line `15`
- `ensureSupported` - line `26`
- `setWallpaperProperties` - line `35`
- `clearWallpaperProperties` - line `59`
- `attach` - line `74`
- `detach` - line `83`
- `reset` - line `94`

### `electron-app/electron/win32-api.js` (5)
- `log` - line `12`
- `attachToWallpaper` - line `23`
- `getDesktopScreenshot` - line `150`
- `findProgman` - line `188`
- `refreshDesktop` - line `213`

### `js/bad-apple.js` (18)
- `toSelector` - line `16`
- `clamp` - line `24`
- `rgbToCss` - line `28`
- `blendRgb` - line `32`
- `parseColor` - line `41`
- `setPayload` - line `218`
- `play` - line `237`
- `pause` - line `278`
- `stop` - line `295`
- `seekFrame` - line `317`
- `renderFrame` - line `343`
- `restoreOriginalStyles` - line `369`
- `_tick` - line `379`
- `_readPixelLevel` - line `408`
- `_resolveAudio` - line `421`
- `_resolveGridCells` - line `434`
- `_resolveCell` - line `447`
- `_rememberOriginalStyles` - line `481`

### `js/download-link-updater.js` (1)
- `updateDownloadLink` - line `4`

### `js/loader.js` (9)
- `createLoaderHTML` - line `140`
- `createParticles` - line `185`
- `showRandomFormula` - line `203`
- `startFormulaRotation` - line `243`
- `updateProgress` - line `252`
- `hideLoader` - line `263`
- `registerModule` - line `295`
- `showLoader` - line `302`
- `initializeModules` - line `321`

### `js/modules/app-runtime.js` (7)
- `updateWallpaperUI` - line `74`
- `applyWallpaperOptimizations` - line `94`
- `loadSettingsState` - line `118`
- `showAppNotification` - line `159`
- `loadSolubility` - line `201`
- `loadCalculator` - line `213`
- `initApp` - line `257`

### `js/modules/balancer.js` (7)
- `positionBalancerPC` - line `178`
- `balanceEquation` - line `395`
- `normalizeInput` - line `444`
- `parseSide` - line `454`
- `parseFormula` - line `463`
- `bruteForceSolver` - line `518`
- `formatChemicalHTML` - line `541`

### `js/modules/calculator.js` (8)
- `addAtomToCalculator` - line `159`
- `renderAtomUI` - line `197`
- `changeQuantity` - line `283`
- `updateTotalMass` - line `302`
- `clearCalculator` - line `318`
- `toggleCalc` - line `330`
- `positionCalculatorPC` - line `388`
- `resetCalculatorPosition` - line `416`

### `js/modules/electron-config.js` (21)
- `normalizeConfigString` - line `85`
- `formatConfig` - line `113`
- `applyExceptionConfig` - line `118`
- `buildOrbitalsFromAtomicNumber` - line `134`
- `buildShellDistribution` - line `148`
- `buildShortConfig` - line `160`
- `expandNobleGasConfig` - line `195`
- `parseElectronConfig` - line `204`
- `buildDerivedConfig` - line `231`
- `getOuterShellInfo` - line `257`
- `getValenceElectrons` - line `266`
- `buildShells` - line `305`
- `getOrbitalCapacity` - line `318`
- `splitElectrons` - line `322`
- `renderOrbitalRow` - line `342`
- `renderOrbitals` - line `364`
- `renderElectronConfigModal` - line `372`
- `openElectronConfigModal` - line `420`
- `closeElectronConfigModal` - line `429`
- `initElectronConfig` - line `440`
- `handleScroll` - line `476`

### `js/modules/latex-export.js` (23)
- `normalizeFormula` - line `8`
- `getElementCompounds` - line `19`
- `getSolubility` - line `28`
- `getCompoundColor` - line `35`
- `getDecompositionReaction` - line `55`
- `renderFormula` - line `109`
- `safeValue` - line `120`
- `toSuperscript` - line `128`
- `formatElectronConfigForPDF` - line `136`
- `getCategoryLabel` - line `144`
- `generateAllotropesHTML` - line `154`
- `generatePDFTemplate` - line `202`
- `normalizeColorValue` - line `240`
- `hexToRgb` - line `254`
- `approximateColorNameFromHex` - line `271`
- `describeColorValue` - line `286`
- `renderColorSwatch` - line `306`
- `hasHtml2PdfSupport` - line `450`
- `hasCanvasPdfSupport` - line `454`
- `loadScriptWithTimeout` - line `458`
- `finish` - line `467`
- `ensurePdfLibrariesLoaded` - line `484`
- `exportElementToPDF` - line `508`

### `js/modules/mobile-layout.js` (7)
- `isMobile` - line `17`
- `getAbsoluteTop` - line `21`
- `ensureWrapper` - line `31`
- `applyTableStyles` - line `74`
- `applyCalcActiveTransform` - line `183`
- `resetTransform` - line `247`
- `init` - line `255`

### `js/modules/modal.js` (6)
- `toggleSection` - line `9`
- `renderModalContent` - line `110`
- `createAllotropeTabs` - line `224`
- `scatterElements` - line `319`
- `returnElements` - line `358`
- `closeModal` - line `452`

### `js/modules/pdf-export.js` (7)
- `getElementCompounds` - line `10`
- `normalizeFormula` - line `20`
- `getSolubility` - line `33`
- `getCompoundColor` - line `45`
- `getDecompositionReaction` - line `60`
- `getSolubilityText` - line `125`
- `generateElementPDF` - line `140`

### `js/modules/radioactive.js` (9)
- `startRadioactiveTimer` - line `25`
- `stopRadioactiveTimer` - line `31`
- `triggerRadioactiveEffect` - line `39`
- `removeRadioactiveEffect` - line `46`
- `startDecaySpread` - line `51`
- `stopDecaySpread` - line `72`
- `crumbleToShards` - line `105`
- `createShard` - line `137`
- `rand` - line `205`

### `js/modules/reactions.js` (172)
- `buildIonMaps` - line `138`
- `stripCharge` - line `143`
- `parseIon` - line `161`
- `normalizeDigits` - line `193`
- `stripLeadingCoeff` - line `197`
- `stripTrailingCondition` - line `201`
- `normalizeToken` - line `210`
- `splitReactants` - line `221`
- `buildKey` - line `232`
- `buildIndex` - line `240`
- `getIonCharge` - line `279`
- `parseRomanNumeral` - line `295`
- `parseOxidationStateFromLabel` - line `308`
- `mergeSubclassTags` - line `319`
- `inferCationChargeFromOxide` - line `336`
- `buildDataMaps` - line `345`
- `gcd` - line `449`
- `lcm` - line `460`
- `parseAcid` - line `464`
- `parseBase` - line `476`
- `isPolyatomic` - line `492`
- `buildSaltFormula` - line `496`
- `normalizeIonKey` - line `511`
- `escapeRegExp` - line `515`
- `getSolubility` - line `519`
- `isInsoluble` - line `532`
- `resolveCationCandidates` - line `536`
- `detectSalt` - line `546`
- `normalizeRawInput` - line `601`
- `hasKeyword` - line `606`
- `hasHeatingCondition` - line `612`
- `hasAllReactants` - line `616`
- `formatCoeff` - line `621`
- `isSaltLikeFormula` - line `626`
- `isWeakAcid` - line `633`
- `isWeakBase` - line `638`
- `isGasProduct` - line `643`
- `buildAcidFormula` - line `647`
- `parseFormulaCounts` - line `656`
- `classifyFormula` - line `710`
- `findHalideSalt` - line `742`
- `extractCondition` - line `761`
- `hasAnyReactant` - line `779`
- `getPresentReactant` - line `784`
- `detectRedoxMedium` - line `789`
- `hasConditionHint` - line `808`
- `hasExcessOn` - line `813`
- `hasDeficitCondition` - line `832`
- `isLikelyOrganicAcid` - line `836`
- `getMetalChargePreferMax` - line `844`
- `ruleNeutralization` - line `848`
- `tryPair` - line `855`
- `ruleBasicOxideWater` - line `879`
- `ruleAcidicOxideWater` - line `899`
- `ruleBasicOxideAcid` - line `916`
- `inferChargeFromOxide` - line `922`
- `ruleAcidicOxideBase` - line `948`
- `ruleBasicOxideAcidicOxide` - line `981`
- `ruleAmphotericAcid` - line `1006`
- `ruleAmphotericBase` - line `1021`
- `ruleMetalWater` - line `1057`
- `ruleMetalOxygen` - line `1080`
- `ruleNonmetalOxygen` - line `1116`
- `ruleHalogenDisplacement` - line `1154`
- `ruleSpecialCombination` - line `1176`
- `ruleMetalAcid` - line `1183`
- `ruleMetalHNO3` - line `1218`
- `ruleMetalH2SO4Conc` - line `1269`
- `ruleAmphotericFusion` - line `1299`
- `ruleAmphotericInAlkali` - line `1326`
- `ruleMetalSteam` - line `1357`
- `ruleHalogenAlkaliDisproportionation` - line `1373`
- `ruleDecompositionNitrates` - line `1394`
- `ruleDecompositionCarbonates` - line `1422`
- `ruleDecompositionHydroxides` - line `1444`
- `ruleHydrolysis` - line `1460`
- `ruleAcidSaltBase` - line `1502`
- `ruleSaltAcidSalt` - line `1522`
- `ruleKMnO4` - line `1540`
- `ruleChromateDichromatePH` - line `1605`
- `ruleChromatePrecipitation` - line `1636`
- `ruleDichromateRedox` - line `1672`
- `ruleK2Cr2O7` - line `1713`
- `ruleChromiumAmphoteric` - line `1719`
- `ruleK2Cr2O7FeSO4` - line `1738`
- `inferElectrolysisMode` - line `1745`
- `buildMoltenHydroxideElectrolysis` - line `1753`
- `classifyElectroAnion` - line `1769`
- `inferAqCathodeProduct` - line `1777`
- `ruleElectrolysis` - line `1785`
- `ruleConcH2SO4WithHalogenHydrides` - line `1876`
- `ruleThermite` - line `1888`
- `rulePeroxideSuperoxide` - line `1899`
- `ruleComplexFormation` - line `1916`
- `ruleAmmoniaAndNOx` - line `1927`
- `ruleSOxOxidation` - line `1947`
- `ruleHalogenHalideAq` - line `1973`
- `ruleAmmoniaWithAcids` - line `1980`
- `ruleQualitativeRedox` - line `1988`
- `ruleHydrogenPeroxide` - line `1998`
- `ruleCarbidesNitridesPhosphidesHydrolysis` - line `2008`
- `ruleNO2Alkali` - line `2018`
- `ruleHalogenWater` - line `2024`
- `ruleThermalOxidizerDecomposition` - line `2032`
- `ruleReductionByCO` - line `2050`
- `ruleReductionByCarbon` - line `2057`
- `ruleDehydration` - line `2064`
- `ruleAquaRegia` - line `2075`
- `ruleSilicicAcid` - line `2086`
- `ruleUnstableAcids` - line `2094`
- `ruleSiliconSpecific` - line `2104`
- `rulePhosphorusSpecific` - line `2137`
- `ruleCarbonSpecific` - line `2154`
- `ruleSulfidesSpecific` - line `2185`
- `ruleIodineStarch` - line `2199`
- `ruleAmmoniaReducing` - line `2213`
- `ruleHalogenLabPreparation` - line `2220`
- `ruleComplexQualitative` - line `2229`
- `ruleAmphotericSaltExcessAlkali` - line `2238`
- `ruleAmmoniumDecomposition` - line `2245`
- `ruleReductionByHydrogen` - line `2254`
- `ruleMetalNonmetalSynthesis` - line `2262`
- `ruleNonmetalNonmetalSynthesis` - line `2273`
- `ruleFe2ToFe3Oxidation` - line `2281`
- `ruleLimewaterCO2` - line `2291`
- `ruleLabAcidGeneration` - line `2299`
- `ruleDecompositionNitratesExtended` - line `2320`
- `ruleSiliconExtended` - line `2381`
- `ruleExtendedComplexes` - line `2441`
- `tryAmmoniate` - line `2455`
- `tryComplexDestruction` - line `2480`
- `tryComplexCO2` - line `2504`
- `tryBeryllate` - line `2517`
- `rulePassivation` - line `2534`
- `tryPassivation` - line `2538`
- `ruleSnPbHNO3` - line `2562`
- `ruleSaltAcid` - line `2582`
- `ruleSaltBase` - line `2606`
- `ruleSaltSalt` - line `2631`
- `ruleMetalSalt` - line `2654`
- `parseEquationCompound` - line `2674`
- `stripPhaseMarkers` - line `2683`
- `buildBalanceMatrix` - line `2687`
- `solveCoefficientsBruteforce` - line `2701`
- `formatBalancedSide` - line `2728`
- `autoBalanceRuleEquation` - line `2735`
- `isGasProductFormula` - line `2754`
- `isPrecipitateFormula` - line `2765`
- `annotateProductPhases` - line `2791`
- `isEquationBalanced` - line `2817`
- `addCounts` - line `2827`
- `postProcessRuleEquation` - line `2851`
- `applyRules` - line `2856`
- `splitAlternatives` - line `2963`
- `patternMatchesInput` - line `2967`
- `detectCandidateRule` - line `2978`
- `detectNoReaction` - line `3008`
- `parseExampleReactants` - line `3197`
- `ruleHintFromExamples` - line `3206`
- `loadReactionsDB` - line `3229`
- `findMatches` - line `3268`
- `findSuggestions` - line `3279`
- `formatExampleEquation` - line `3305`
- `isCorruptedDbText` - line `3314`
- `pickBestExampleMatch` - line `3323`
- `appendFusionVariantIfRelevant` - line `3333`
- `renderOutput` - line `3356`
- `updateTags` - line `3359`
- `debounce` - line `3509`
- `initReactionsUI` - line `3517`
- `update` - line `3525`
- `bootstrap` - line `3566`

### `js/modules/search-filters.js` (23)
- `isSolubilityModalOpen` - line `14`
- `captureDefaultCategoriesHTML` - line `21`
- `applyCategoryFilterFromButton` - line `29`
- `attachCategoryFilterHandlers` - line `48`
- `performSearch` - line `72`
- `findElementBySymbol` - line `126`
- `checkOverlapAndCloseFilters` - line `146`
- `highlightElementInTable` - line `178`
- `clearElementHighlight` - line `205`
- `searchElements` - line `211`
- `searchInAllotrope` - line `275`
- `displaySearchResults` - line `290`
- `truncateText` - line `317`
- `openSearchResult` - line `322`
- `highlightSearchTerm` - line `341`
- `escapeRegex` - line `375`
- `clearSearch` - line `379`
- `setupSearch` - line `398`
- `closeFiltersPanel` - line `426`
- `toggleFilters` - line `446`
- `resetFilters` - line `491`
- `applyCategoryFilter` - line `563`
- `resetTableDisplay` - line `582`

### `js/modules/theme-toggle.js` (4)
- `setState` - line `10`
- `getCurrentTheme` - line `15`
- `getNextTheme` - line `22`
- `handleToggle` - line `24`

### `js/modules/theme.js` (4)
- `toggleTheme` - line `8`
- `easeOut` - line `110`
- `animate` - line `115`
- `finalize` - line `150`

### `js/modules/ui.js` (15)
- `toggleMenu` - line `4`
- `toggleParticles` - line `20`
- `updateParticlesToggleUI` - line `30`
- `resetFabPosition` - line `43`
- `initDragScroll` - line `58`
- `stopDrag` - line `76`
- `initPanHints` - line `137`
- `update` - line `141`
- `buildPanHints` - line `174`
- `setHintVisible` - line `196`
- `initUI` - line `425`
- `bindReactionsBackdrop` - line `431`
- `lockVerticalScroll` - line `447`
- `unlockVerticalScroll` - line `455`
- `handleOrientationChange` - line `493`

### `js/nodemap/nodemap-canvas.js` (24)
- `resize` - line `56`
- `setupEventListeners` - line `71`
- `screenToWorld` - line `103`
- `worldToScreen` - line `111`
- `onMouseDown` - line `119`
- `onMouseMove` - line `128`
- `onMouseUp` - line `151`
- `onWheel` - line `157`
- `onClick` - line `184`
- `onTouchStart` - line `204`
- `onTouchMove` - line `210`
- `onTouchEnd` - line `220`
- `getNodeAt` - line `226`
- `centerOnNode` - line `237`
- `fitToView` - line `244`
- `render` - line `272`
- `renderConnections` - line `298`
- `drawArrowHead` - line `340`
- `renderNodes` - line `360`
- `renderNode` - line `370`
- `truncateText` - line `426`
- `renderOverlay` - line `438`
- `updateTheme` - line `447`
- `destroy` - line `464`

### `js/nodemap/nodemap-flow-canvas.js` (16)
- `setData` - line `53`
- `setupEvents` - line `58`
- `render` - line `72`
- `renderConnections` - line `99`
- `drawArrow` - line `180`
- `renderNodes` - line `199`
- `renderNode` - line `205`
- `drawShape` - line `249`
- `truncate` - line `294`
- `onMouseDown` - line `300`
- `onMouseMove` - line `308`
- `onMouseUp` - line `320`
- `onWheel` - line `325`
- `onTouchStart` - line `348`
- `onTouchMove` - line `355`
- `fitToView` - line `367`

### `js/nodemap/nodemap-flow-layout.js` (4)
- `calculate` - line `17`
- `groupByLevels` - line `46`
- `calculatePositions` - line `58`
- `getBounds` - line `86`

### `js/nodemap/nodemap-init.js` (1)
- `init` - line `12`

### `js/nodemap/nodemap-layout.js` (19)
- `calculate` - line `25`
- `createNodes` - line `42`
- `calculateNodeWidth` - line `62`
- `createConnections` - line `78`
- `initializePositions` - line `96`
- `detectLayoutStrategy` - line `112`
- `hasLayeredStructure` - line `124`
- `hierarchicalLayout` - line `139`
- `calculateLayers` - line `160`
- `circularLayout` - line `209`
- `randomLayout` - line `221`
- `runSimulation` - line `231`
- `applyRepulsion` - line `251`
- `applyAttraction` - line `278`
- `applyCentering` - line `299`
- `updatePositions` - line `307`
- `preventOverlaps` - line `318`
- `findClusters` - line `350`
- `dfs` - line `353`

### `js/nodemap/nodemap-modal.js` (24)
- `createModal` - line `20`
- `setupEventListeners` - line `123`
- `open` - line `167`
- `switchMode` - line `182`
- `runFlowMode` - line `200`
- `close` - line `245`
- `isOpen` - line `250`
- `runAnalysis` - line `255`
- `updateStats` - line `299`
- `updateFilters` - line `313`
- `checkWarnings` - line `334`
- `renderWarnings` - line `379`
- `onSearch` - line `402`
- `filterByType` - line `427`
- `onNodeSelected` - line `442`
- `showNodeInfo` - line `451`
- `clearNodeInfo` - line `506`
- `fitToView` - line `515`
- `resetZoom` - line `522`
- `refresh` - line `532`
- `showError` - line `537`
- `updateTheme` - line `552`
- `updateNodeMapTheme` - line `562`
- `openNodeMap` - line `573`

### `js/nodemap/nodemap-parser.js` (18)
- `analyzeProject` - line `26`
- `findGlobalFunctions` - line `38`
- `isNativeFunction` - line `76`
- `analyzeDependencies` - line `93`
- `extractFunctionCalls` - line `117`
- `extractParams` - line `157`
- `getFunctionName` - line `168`
- `calculateComplexity` - line `174`
- `hasEventListeners` - line `199`
- `buildReverseLinks` - line `204`
- `calculateMetrics` - line `215`
- `getTemperature` - line `229`
- `classifyNode` - line `238`
- `countConnections` - line `252`
- `findCircularDependencies` - line `261`
- `dfs` - line `265`
- `findDeadCode` - line `302`
- `getStatistics` - line `309`

### `js/particles.js` (15)
- `updateInteractionSettings` - line `90`
- `updateMousePosition` - line `97`
- `isClickOnUi` - line `121`
- `spawnParticlesAt` - line `129`
- `applyMouseInteraction` - line `147`
- `createSpecificAtoms` - line `178`
- `update` - line `253`
- `draw` - line `260`
- `getColor` - line `343`
- `updateColor` - line `362`
- `overcrowdKillThreshold` - line `374`
- `applyParticleSeparationAndCull` - line `378`
- `initParticles` - line `461`
- `redrawParticles` - line `471`
- `animate` - line `499`

### `js/scroll-collapse.js` (12)
- `isMobile` - line `27`
- `getThreshold` - line `32`
- `getMinScale` - line `37`
- `handleVirtualScroll` - line `42`
- `updateTableScale` - line `75`
- `unlockScroll` - line `97`
- `lockScroll` - line `110`
- `handleWheel` - line `125`
- `handleTouchStart` - line `152`
- `handleTouchMove` - line `169`
- `handlePageScroll` - line `197`
- `init` - line `215`

### `js/scrypt.js` (21)
- `updateProgress` - line `61`
- `loadScript` - line `72`
- `loadScripts` - line `91`
- `loadScriptSafe` - line `97`
- `loadScriptsSafe` - line `121`
- `getBadAppleAudioElement` - line `139`
- `resolveBadApplePayload` - line `147`
- `isSolubilityModalVisible` - line `173`
- `restoreInlineStyle` - line `181`
- `clearBadAppleSolubilityScale` - line `192`
- `fitSolubilityTableToViewport` - line `201`
- `buildSampleIndices` - line `248`
- `buildSolubilityGridMap` - line `263`
- `ensureBadApplePlayer` - line `296`
- `startBadApplePlayback` - line `355`
- `stopBadApplePlayback` - line `382`
- `isTypingContext` - line `391`
- `handleBadAppleKeydown` - line `402`
- `initBadAppleHotkey` - line `450`
- `init` - line `460`
- `runCore` - line `467`

### `js/solubility/advanced-modal.js` (24)
- `ensureAdvancedModeHint` - line `13`
- `hideAdvancedModeHint` - line `30`
- `showAdvancedModeHint` - line `47`
- `initAdvancedModeButton` - line `67`
- `syncButtonState` - line `73`
- `openAdvancedModal` - line `97`
- `closeAdvancedModal` - line `103`
- `generateFormula` - line `185`
- `gcd` - line `191`
- `generateSubstanceName` - line `218`
- `capitalize` - line `237`
- `calculateMolarMass` - line `243`
- `getSolubilityInfo` - line `269`
- `getSubstanceColor` - line `291`
- `lightenColor` - line `297`
- `darkenColor` - line `321`
- `generateCrystalSVG` - line `345`
- `isTransparentAppearanceColor` - line `408`
- `generateFlaskSVG` - line `420`
- `renderAdvancedContent` - line `509`
- `renderInfoTab` - line `547`
- `renderAppearanceTab` - line `589`
- `getColorName` - line `646`
- `switchAdvancedTab` - line `677`

### `js/solubility/colors.js` (12)
- `syncColorModeButtonState` - line `24`
- `normalizeFormula` - line `41`
- `isColorDark` - line `71`
- `toggleColorMode` - line `85`
- `getColorName` - line `111`
- `getGroupedColorName` - line `177`
- `approximateGroupedColorByRGB` - line `242`
- `approximateGroupedColorByName` - line `286`
- `approximateColorByRGB` - line `329`
- `hexToRgb` - line `376`
- `getUniqueColorsFromTable` - line `389`
- `toggleNonmetalsSeries` - line `444`

### `js/solubility/data.js` (1)
- `getSolubility` - line `764`

### `js/solubility/filters.js` (8)
- `updateFiltersForSolubility` - line `6`
- `filterByColor` - line `59`
- `filterBySolubility` - line `104`
- `resetSolubilityTableDisplay` - line `119`
- `restoreElementFilters` - line `132`
- `attachHandlerToButton` - line `158`
- `setupFilterEventHandlers` - line `264`
- `isColorDarkForFilters` - line `323`

### `js/solubility/modal.js` (4)
- `bindCloseEvents` - line `158`
- `onBackdrop` - line `178`
- `setupSolubilityPanHints` - line `211`
- `update` - line `239`

### `js/solubility/search.js` (6)
- `toggleSolubilitySearch` - line `4`
- `clearSolubilitySearch` - line `21`
- `performSolubilitySearch` - line `32`
- `setupSolubilitySearch` - line `58`
- `parseChemicalFormula` - line `88`
- `searchInSolubilityTable` - line `156`

### `js/solubility/solubility-table.js` (8)
- `renderSolubilityTable` - line `6`
- `clearTableSelection` - line `194`
- `highlightCrosshair` - line `203`
- `highlightColumn` - line `240`
- `highlightRow` - line `260`
- `enableDragScroll` - line `282`
- `getCellSubstanceKey` - line `385`
- `updateActivitySeriesFlow` - line `404`

### `js/utils.js` (2)
- `getDeviceType` - line `6`
- `addDeviceClassToBody` - line `46`

### `js/wallpaper-handler.js` (3)
- `isElectronAvailable` - line `9`
- `showNotification` - line `16`
- `initWallpaperButton` - line `111`


