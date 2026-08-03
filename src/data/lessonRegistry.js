/**
 * [프로젝트 구조 안내] 문자열 lesson key와 실제 React 예제 컴포넌트를 연결하는 등록표입니다.
 * App은 URL에서 얻은 key로 이 객체를 조회하므로 파일을 만들기만 하고 여기에 등록하지 않으면 실행되지 않습니다.
 * import 경로와 객체 아래쪽의 같은 key가 한 쌍인지 확인하는 것이 가장 중요한 유지보수 규칙입니다.
 */
import Step0101EmptyDiagram from "../examples/01-diagram-basic/Step0101EmptyDiagram";
import Step0102DiagramSize from "../examples/01-diagram-basic/Step0102DiagramSize";
import Step0103DiagramBackground from "../examples/01-diagram-basic/Step0103DiagramBackground";
import Step0201SingleNode from "../examples/02-general-node/Step0201SingleNode";
import Step0202TwoNodes from "../examples/02-general-node/Step0202TwoNodes";
import Step0203FactoryNode from "../examples/02-general-node/Step0203FactoryNode";
import Step0204DirectNode from "../examples/02-general-node/Step0204DirectNode";
import Step0205CreationComparison from "../examples/02-general-node/Step0205CreationComparison";
import Step0206NodePosition from "../examples/02-general-node/Step0206NodePosition";
import Step0207NodeSize from "../examples/02-general-node/Step0207NodeSize";
import Step0208NodeText from "../examples/02-general-node/Step0208NodeText";
import Step0209MultilineText from "../examples/02-general-node/Step0209MultilineText";
import Step0210TextAlignment from "../examples/02-general-node/Step0210TextAlignment";
import Step0211NodeBackground from "../examples/02-general-node/Step0211NodeBackground";
import Step0212NodeBorder from "../examples/02-general-node/Step0212NodeBorder";
import Step0301TextPadding from "../examples/03-node-content/Step0301TextPadding";
import Step0302FontStyle from "../examples/03-node-content/Step0302FontStyle";
import Step0303TextStroke from "../examples/03-node-content/Step0303TextStroke";
import Step0304ClipText from "../examples/03-node-content/Step0304ClipText";
import Step0305ResizeToFitText from "../examples/03-node-content/Step0305ResizeToFitText";
import Step0401NodeClick from "../examples/04-selection-events/Step0401NodeClick";
import Step0402SingleSelection from "../examples/04-selection-events/Step0402SingleSelection";
import Step0403MultipleSelection from "../examples/04-selection-events/Step0403MultipleSelection";
import Step0404SelectionChanged from "../examples/04-selection-events/Step0404SelectionChanged";
import Step0405NodeDoubleClick from "../examples/04-selection-events/Step0405NodeDoubleClick";
import Step0501SingleLink from "../examples/05-links/Step0501SingleLink";
import Step0502TwoLinks from "../examples/05-links/Step0502TwoLinks";
import Step0503LinkText from "../examples/05-links/Step0503LinkText";
import Step0504ArrowHead from "../examples/05-links/Step0504ArrowHead";
import Step0505LinkStyles from "../examples/05-links/Step0505LinkStyles";
import Step0601ParentOneChild from "../examples/06-parent-child-tree/Step0601ParentOneChild";
import Step0602ParentTwoChildren from "../examples/06-parent-child-tree/Step0602ParentTwoChildren";
import Step0603ParentFiveChildren from "../examples/06-parent-child-tree/Step0603ParentFiveChildren";
import Step0604Grandchildren from "../examples/06-parent-child-tree/Step0604Grandchildren";
import Step0605ThreeLevelTree from "../examples/06-parent-child-tree/Step0605ThreeLevelTree";
import Step0701VerticalTreeLayout from "../examples/07-tree-layout/Step0701VerticalTreeLayout";
import Step0702LayoutSpacing from "../examples/07-tree-layout/Step0702LayoutSpacing";
import Step0703HorizontalTreeLayout from "../examples/07-tree-layout/Step0703HorizontalTreeLayout";
import Step0704ThreeLevelAutoLayout from "../examples/07-tree-layout/Step0704ThreeLevelAutoLayout";
import Step0705RelayoutAfterAdd from "../examples/07-tree-layout/Step0705RelayoutAfterAdd";
import Step0801CollapseChildren from "../examples/08-collapse-expand/Step0801CollapseChildren";
import Step0802RecursiveCollapse from "../examples/08-collapse-expand/Step0802RecursiveCollapse";
import Step0803RestoreState from "../examples/08-collapse-expand/Step0803RestoreState";
import Step0804CollapseAll from "../examples/08-collapse-expand/Step0804CollapseAll";
import Step0805ExpandAll from "../examples/08-collapse-expand/Step0805ExpandAll";
import Step0806ExpandToDepth from "../examples/08-collapse-expand/Step0806ExpandToDepth";
import Step0901HtmlText from "../examples/09-html-control-node/Step0901HtmlText";
import Step0902TitleDescription from "../examples/09-html-control-node/Step0902TitleDescription";
import Step0903Image from "../examples/09-html-control-node/Step0903Image";
import Step0904Alternatives from "../examples/09-html-control-node/Step0904Alternatives";
import Step1001ButtonStyle from "../examples/10-html-node-elements/Step1001ButtonStyle";
import Step1002ButtonDomSearch from "../examples/10-html-node-elements/Step1002ButtonDomSearch";
import Step1101ButtonClick from "../examples/11-html-node-events/Step1101ButtonClick";
import Step1102MoveClickSeparation from "../examples/11-html-node-events/Step1102MoveClickSeparation";
import Step1103PreventDuplicate from "../examples/11-html-node-events/Step1103PreventDuplicate";
import Step1104CleanupOnUnmount from "../examples/11-html-node-events/Step1104CleanupOnUnmount";
import Step1201OneCard from "../examples/12-business-cards/Step1201OneCard";
import Step1202TwoCards from "../examples/12-business-cards/Step1202TwoCards";
import Step1203ThreeCards from "../examples/12-business-cards/Step1203ThreeCards";
import Step1204FiveCards from "../examples/12-business-cards/Step1204FiveCards";
import Step1301CollapsedBeforeSelection from "../examples/13-expand-on-selection/Step1301CollapsedBeforeSelection";
import Step1302ExpandSelected from "../examples/13-expand-on-selection/Step1302ExpandSelected";
import Step1303RestoreOnDeselect from "../examples/13-expand-on-selection/Step1303RestoreOnDeselect";
import Step1304SizeByCardCount from "../examples/13-expand-on-selection/Step1304SizeByCardCount";
import Step1305InternalExpandClose from "../examples/13-expand-on-selection/Step1305InternalExpandClose";
import Step1401ProfileContent from "../examples/14-image-title-description/Step1401ProfileContent";
import Step1402ImageFallback from "../examples/14-image-title-description/Step1402ImageFallback";
import Step1403EmptyData from "../examples/14-image-title-description/Step1403EmptyData";
import Step1404CardClickSelection from "../examples/14-image-title-description/Step1404CardClickSelection";
import Step1501RichRootNode from "../examples/15-composite-content-tree/Step1501RichRootNode";
import Step1502ChildrenGrandchildren from "../examples/15-composite-content-tree/Step1502ChildrenGrandchildren";
import Step1503RecursiveTreeControls from "../examples/15-composite-content-tree/Step1503RecursiveTreeControls";
import Step1601CenterSelectedNode from "../examples/16-external-tools/Step1601CenterSelectedNode";
import Step1602ViewportControls from "../examples/16-external-tools/Step1602ViewportControls";
import Step1603DetailPanel from "../examples/16-external-tools/Step1603DetailPanel";
import Step1701JsonData from "../examples/17-data-integration/Step1701JsonData";
import Step1702MockApiLoading from "../examples/17-data-integration/Step1702MockApiLoading";
import Step1703DataError from "../examples/17-data-integration/Step1703DataError";
import Step1704EmptyData from "../examples/17-data-integration/Step1704EmptyData";
import Step1801SearchNodes from "../examples/18-runtime-verification/Step1801SearchNodes";
import Step1802FilterNodes from "../examples/18-runtime-verification/Step1802FilterNodes";
import Step1803AutomaticVerification from "../examples/18-runtime-verification/Step1803AutomaticVerification";
import Step1901IntegratedExplorer from "../examples/19-final-example/Step1901IntegratedExplorer";
import Step1916CityTreeOverview from "../examples/19-final-example/Step1916CityTreeOverview";
import Step1917CityTreeBasic from "../examples/19-final-example/Step1917CityTreeBasic";
import Step1918CityTreeMultipleRoots from "../examples/19-final-example/Step1918CityTreeMultipleRoots";
import Step1919CityTreeNestedChildren from "../examples/19-final-example/Step1919CityTreeNestedChildren";
import Step1920CityTreeExternalIcons from "../examples/19-final-example/Step1920CityTreeExternalIcons";
import Step1921CityTreeDetailButton from "../examples/19-final-example/Step1921CityTreeDetailButton";
import Step1922CityTreeExpandedNode from "../examples/19-final-example/Step1922CityTreeExpandedNode";
import Step1923CityTreeFeatureTooltip from "../examples/19-final-example/Step1923CityTreeFeatureTooltip";
import Step1924CityTreeDetailPanel from "../examples/19-final-example/Step1924CityTreeDetailPanel";
import Step1925CityTreeControls from "../examples/19-final-example/Step1925CityTreeControls";
import Step1926CityTreeFinal from "../examples/19-final-example/Step1926CityTreeFinal";

export const lessonRegistry = {
  "01-01": Step0101EmptyDiagram,
  "01-02": Step0102DiagramSize,
  "01-03": Step0103DiagramBackground,
  "02-01": Step0201SingleNode,
  "02-02": Step0202TwoNodes,
  "02-03": Step0203FactoryNode,
  "02-04": Step0204DirectNode,
  "02-05": Step0205CreationComparison,
  "02-06": Step0206NodePosition,
  "02-07": Step0207NodeSize,
  "02-08": Step0208NodeText,
  "02-09": Step0209MultilineText,
  "02-10": Step0210TextAlignment,
  "02-11": Step0211NodeBackground,
  "02-12": Step0212NodeBorder,
  "03-01": Step0301TextPadding,
  "03-02": Step0302FontStyle,
  "03-03": Step0303TextStroke,
  "03-04": Step0304ClipText,
  "03-05": Step0305ResizeToFitText,
  "04-01": Step0401NodeClick,
  "04-02": Step0402SingleSelection,
  "04-03": Step0403MultipleSelection,
  "04-04": Step0404SelectionChanged,
  "04-05": Step0405NodeDoubleClick,
  "05-01": Step0501SingleLink,
  "05-02": Step0502TwoLinks,
  "05-03": Step0503LinkText,
  "05-04": Step0504ArrowHead,
  "05-05": Step0505LinkStyles,
  "06-01": Step0601ParentOneChild,
  "06-02": Step0602ParentTwoChildren,
  "06-03": Step0603ParentFiveChildren,
  "06-04": Step0604Grandchildren,
  "06-05": Step0605ThreeLevelTree,
  "07-01": Step0701VerticalTreeLayout,
  "07-02": Step0702LayoutSpacing,
  "07-03": Step0703HorizontalTreeLayout,
  "07-04": Step0704ThreeLevelAutoLayout,
  "07-05": Step0705RelayoutAfterAdd,
  "08-01": Step0801CollapseChildren,
  "08-02": Step0802RecursiveCollapse,
  "08-03": Step0803RestoreState,
  "08-04": Step0804CollapseAll,
  "08-05": Step0805ExpandAll,
  "08-06": Step0806ExpandToDepth,
  "09-01": Step0901HtmlText,
  "09-02": Step0902TitleDescription,
  "09-03": Step0903Image,
  "09-04": Step0904Alternatives,
  "10-01": Step1001ButtonStyle,
  "10-02": Step1002ButtonDomSearch,
  "11-01": Step1101ButtonClick,
  "11-02": Step1102MoveClickSeparation,
  "11-03": Step1103PreventDuplicate,
  "11-04": Step1104CleanupOnUnmount,
  "12-01": Step1201OneCard,
  "12-02": Step1202TwoCards,
  "12-03": Step1203ThreeCards,
  "12-04": Step1204FiveCards,
  "13-01": Step1301CollapsedBeforeSelection,
  "13-02": Step1302ExpandSelected,
  "13-03": Step1303RestoreOnDeselect,
  "13-04": Step1304SizeByCardCount,
  "13-05": Step1305InternalExpandClose,
  "14-01": Step1401ProfileContent,
  "14-02": Step1402ImageFallback,
  "14-03": Step1403EmptyData,
  "14-04": Step1404CardClickSelection,
  "15-01": Step1501RichRootNode,
  "15-02": Step1502ChildrenGrandchildren,
  "15-03": Step1503RecursiveTreeControls,
  "16-01": Step1601CenterSelectedNode,
  "16-02": Step1602ViewportControls,
  "16-03": Step1603DetailPanel,
  "17-01": Step1701JsonData,
  "17-02": Step1702MockApiLoading,
  "17-03": Step1703DataError,
  "17-04": Step1704EmptyData,
  "18-01": Step1801SearchNodes,
  "18-02": Step1802FilterNodes,
  "18-03": Step1803AutomaticVerification,
  "19-01": Step1901IntegratedExplorer,
  "19-16": Step1916CityTreeOverview,
  "19-17": Step1917CityTreeBasic,
  "19-18": Step1918CityTreeMultipleRoots,
  "19-19": Step1919CityTreeNestedChildren,
  "19-20": Step1920CityTreeExternalIcons,
  "19-21": Step1921CityTreeDetailButton,
  "19-22": Step1922CityTreeExpandedNode,
  "19-23": Step1923CityTreeFeatureTooltip,
  "19-24": Step1924CityTreeDetailPanel,
  "19-25": Step1925CityTreeControls,
  "19-26": Step1926CityTreeFinal,
};
