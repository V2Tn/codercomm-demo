import Link from "./Link";
import Card from "./Card";
import Tab from "./Tabs";
function customizeComponents(theme) {
  return { ...Tab(theme), ...Card(theme), ...Link(theme) };
}

export default customizeComponents;
