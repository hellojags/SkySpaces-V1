import React, { PureComponent } from "react";
import debounce from "lodash.debounce";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import Chip from "@material-ui/core/Chip";

export default class SnCarousalMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      items: Object.keys(this.props.itemsObj),
      hasOverflow: false,
      canScrollLeft: false,
      selectedItems: this.props.selectedItems,
      canScrollRight: false,
    };

    this.checkForOverflow = this.checkForOverflow.bind(this);
    this.checkForScrollPosition = this.checkForScrollPosition.bind(this);

    this.debounceCheckForOverflow = debounce(this.checkForOverflow, 1000);
    this.debounceCheckForScrollPosition = debounce(
      this.checkForScrollPosition,
      200
    );

    this.container = null;
  }

  componentDidMount() {
    this.checkForOverflow();
    this.checkForScrollPosition();

    this.container.addEventListener(
      "scroll",
      this.debounceCheckForScrollPosition
    );
  }

  componentWillUnmount() {
    this.container.removeEventListener(
      "scroll",
      this.debounceCheckForScrollPosition
    );
    this.debounceCheckForOverflow.cancel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items.length !== this.state.items.length) {
      this.checkForOverflow();
      this.checkForScrollPosition();
    }
    if (this.state.selectedItems !== this.props.selectedItems) {
      this.setState({
        selectedItems: this.props.selectedItems,
      });
    }
    if (
      JSON.stringify(this.state.items.sort()) !==
      JSON.stringify(Object.keys(this.props.itemsObj).sort())
    ) {
      this.setState({
        items: Object.keys(this.props.itemsObj),
      });
    }
  }

  checkForScrollPosition() {
    const { scrollLeft, scrollWidth, clientWidth } = this.container;

    this.setState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft !== scrollWidth - clientWidth,
    });
  }

  checkForOverflow() {
    const { scrollWidth, clientWidth } = this.container;
    const hasOverflow = scrollWidth > clientWidth;

    this.setState({ hasOverflow });
  }

  scrollContainerBy(distance) {
    this.container.scrollBy({ left: distance, behavior: "smooth" });
  }

  modifySelected = (item) => {
    const { selectedItems } = this.state;
    const itemIndex = selectedItems.indexOf(item);
    if (itemIndex > -1) {
      selectedItems.splice(itemIndex, 1);
    } else {
      selectedItems.push(item);
    }
    this.setState({ selectedItems });
    this.props.onUpdate && this.props.onUpdate(this.state.selectedItems);
  };

  buildItems() {
    return this.state.items.map((item) => {
      return (
        <li
          className={`item ${
            this.state.selectedItems.indexOf(item) > -1 ? "active" : ""
          }`}
          key={item}
        >
          {this.props.itemsObj[item] && (
            <Tooltip
              arrow
              title={
                this.props.itemsObj[item][this.props.labelKey] &&
                this.props.itemsObj[item][this.props.labelKey].length >
                  (this.props.showTooltipFrom ? this.props.showTooltipFrom : 10)
                  ? this.props.itemsObj[item][this.props.labelKey]
                  : ""
              }
            >
              <Chip
                className="cursor-pointer"
                label={this.props.itemsObj[item][this.props.labelKey]}
                onClick={() => this.modifySelected(item)}
              />
            </Tooltip>
          )}
        </li>
      );
    });
  }

  render() {
    const { canScrollLeft, canScrollRight } = this.state;
    const { type } = this.props;
    if (type == null) {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
          ref={(node) => {
            this.container = node;
          }}
        >
          {this.state.items.map((item) => {
            let icon;

            return (
              <div key={item}>
                {this.props.itemsObj[item] && (
                  <Tooltip
                    arrow
                    title={
                      this.props.itemsObj[item][this.props.labelKey] &&
                      this.props.itemsObj[item][this.props.labelKey].length >
                        (this.props.showTooltipFrom
                          ? this.props.showTooltipFrom
                          : 10)
                        ? this.props.itemsObj[item][this.props.labelKey]
                        : ""
                    }
                  >
                    <Chip
                      icon={icon}
                      label={this.props.itemsObj[item][this.props.labelKey]}
                      onClick={() => this.modifySelected(item)}
                      className={`item ${
                        this.state.selectedItems.indexOf(item) > -1
                          ? "active"
                          : ""
                      }`}
                      size = "small"
                    />
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      );
    } else if (type === "ADVANCE") {
      return (
        <div className="carousal-menu-root">
          {canScrollLeft && (
            <Tooltip title="Delete" arrow>
              <IconButton
                onClick={() => {
                  this.scrollContainerBy(-200);
                }}
              >
                <ArrowBackIosOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          <ul
            className="item-container"
            ref={(node) => {
              this.container = node;
            }}
          >
            {this.buildItems()}
          </ul>
          {canScrollRight && (
            <Tooltip title="Delete" arrow>
              <IconButton
                onClick={() => {
                  this.scrollContainerBy(200);
                }}
              >
                <ArrowForwardIosOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    }
  }
}
