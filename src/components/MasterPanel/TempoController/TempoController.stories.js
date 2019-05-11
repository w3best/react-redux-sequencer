import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import TempoController from "./TempoController"

storiesOf("TempoController", module)
  .addDecorator(story => (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "3rem",
        backgroundColor: "#1e1f26"
      }}
    >
      {story()}
    </div>
  ))
  .add("horizontal tempo=120", () => (
    <TempoController
      color={"blueGrey"}
      tempo={120}
      onChange={action("onChange")}
    />
  ))