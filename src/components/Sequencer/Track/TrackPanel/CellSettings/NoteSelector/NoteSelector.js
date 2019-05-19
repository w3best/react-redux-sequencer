// @flow strict
import * as React from "react"
// $FlowFixMe
import styled from "styled-components/macro"

import Key from "./Key"
import MidiConverter from "../../../../../../utils/audio/MidiConverter"

import type {
  Cell,
  Session,
  Track
} from "../../../../../../redux/store/session/types"
import type { Sample } from "../../../../../../redux/store/sample/types"

type OwnProps = {
  height: number,
  keyWidth: number
}

type StateProps = {
  color: $PropertyType<Track, "color">,
  activeNote: $PropertyType<Cell, "midi">,
  activeTrackID: $PropertyType<Session, "activeTrackID">,
  activeCellBeat: $PropertyType<Session, "activeCellBeat">,
  getMappingForNote: (note: number) => { sampleID: string, detune: number },
  getSample: (note: number) => Sample
}

type DispatchProps = {
  changeCellNote: (note: number, beat: number, TrackID: string) => void,
  listenCellNote: (note: number, beat: number, trackID: string) => void
}

type Props = OwnProps & StateProps & DispatchProps

const StyledSelector = styled.div`
  font-size: 13px;
`

const Info = styled.div`
  display: flex;
  margin-bottom: ${({ keyWidth }) => keyWidth}px;
`

const InfoItem = styled.div`
  width: ${({ itemWidth }) => itemWidth || "10%"};
  margin-left: ${({ keyWidth }) => keyWidth || 0}px;
`

const Keys = styled.div`
  display: flex;
  height: ${({ height }) => height}px;
`

const KeyWrapper = styled.div`
  margin-bottom: ${({ blackKey, height }) => (blackKey ? height * 0.4 : 0)}px;
  margin-left: ${({ blackKey, keyWidth, widthRatio }) =>
    blackKey ? -(keyWidth * widthRatio) / 2.0 : 0}px;
  margin-right: ${({ blackKey, keyWidth, widthRatio }) =>
    blackKey ? -(keyWidth * widthRatio) / 2.0 : 0}px;
  z-index: ${({ blackKey }) => (blackKey ? 10 : 1)};
`

// used to compute the width of a black key
const widthRatio = 0.75

const NoteSelector = React.memo<Props>(function NoteSelector(props: Props) {
  const [noteOnHover, setNoteOnHover] = React.useState(null)

  if (props.activeTrackID === null || props.activeCellBeat === null)
    return <div />

  const filename =
    noteOnHover !== null ? props.getSample(noteOnHover).label : ""

  const detune =
    noteOnHover !== null ? props.getMappingForNote(noteOnHover).detune : ""

  return (
    <StyledSelector>
      {noteOnHover !== null ? (
        <Info keyWidth={props.keyWidth}>
          <InfoItem itemWidth={"10%"}>
            <div>
              <span style={{ fontWeight: "lighter" }}>NOTE</span>{" "}
              {MidiConverter.toNote(noteOnHover)} ({noteOnHover})
            </div>
          </InfoItem>
          <InfoItem keyWidth={props.keyWidth} itemWidth={"10%"}>
            <span style={{ fontWeight: "lighter" }}>DETUNE</span> {detune} cent
          </InfoItem>
          <InfoItem keyWidth={props.keyWidth} itemWidth={"30%"}>
            <span style={{ fontWeight: "lighter" }}>SAMPLE</span> {filename}
          </InfoItem>
        </Info>
      ) : (
        <Info keyWidth={props.keyWidth} style={{ opacity: 0 }}>
          <span role="img" aria-label="keyboard">
            🎹
          </span>
        </Info>
      )}

      <Keys height={props.height}>
        {[...Array(128).keys()].map(midiNote => {
          const blackKey = [1, 3, 6, 8, 10].includes(midiNote % 12)

          return (
            <KeyWrapper
              key={midiNote}
              blackKey={blackKey}
              keyWidth={props.keyWidth}
              height={props.height}
              widthRatio={widthRatio}
            >
              <Key
                active={midiNote === props.activeNote}
                midiNote={midiNote}
                width={blackKey ? props.keyWidth * widthRatio : props.keyWidth}
                color={props.color}
                black={blackKey}
                onClick={() => {
                  if (
                    props.activeTrackID === null ||
                    props.activeCellBeat === null
                  )
                    return

                  props.changeCellNote(
                    midiNote,
                    props.activeCellBeat,
                    props.activeTrackID
                  )
                }}
                onHoverStart={() => {
                  if (
                    props.activeTrackID === null ||
                    props.activeCellBeat === null
                  )
                    return

                  props.listenCellNote(
                    midiNote,
                    props.activeCellBeat,
                    props.activeTrackID
                  )
                  setNoteOnHover(midiNote)
                }}
                onHoverStop={() => setNoteOnHover(null)}
              />
            </KeyWrapper>
          )
        })}
      </Keys>
    </StyledSelector>
  )
})

export default NoteSelector
