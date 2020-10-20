import React, { useRef } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import IconFastForward from './fastForward.icon';
import IconNextBack from './nextBack.icon';
import { StyleWrapper } from './component.style';

const Buttons = ({
  readonly,
  rereading,
  page,
  canContinue,
  isLastComponent,
  pagePrevious,
  pageNext,
  pageFastForward,
  finalQuit,
}) => {
  const nextButtonRef = useRef();
  const fastNextButtonRef = useRef();
  const returnLabel = page === 0 ? '' : D.goBackReturn;
  const pageNextFunction = isLastComponent ? finalQuit : pageNext;

  const keysToHandle = ['alt+enter', 'alt+backspace', 'alt+end'];

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter' && ((!isLastComponent && rereading && canContinue) || readonly)) {
      if (nextButtonRef && nextButtonRef.current) nextButtonRef.current.focus();
      pageNextFunction();
    }
    if (key === 'alt+backspace') pagePrevious();
    if (key === 'alt+end' && !readonly && rereading && !isLastComponent) {
      if (fastNextButtonRef && fastNextButtonRef.current) fastNextButtonRef.current.focus();
      pageFastForward();
    }
  };

  return (
    <>
      <StyleWrapper id="buttons" className={!returnLabel && 'btn-alone'}>
        {returnLabel && (
          <div className="short-button navigation">
            <button className="navigation-button short" type="button" onClick={pagePrevious}>
              <IconNextBack back className="next-icon" />
            </button>
            <span>{D.goBackReturn}</span>
          </div>
        )}
        {((readonly && !isLastComponent) || (!isLastComponent && rereading)) && (
          <div className="short-button next navigation">
            <button
              ref={nextButtonRef}
              aria-label={D.nextButtonLabel}
              className="navigation-button short"
              type="button"
              onClick={pageNext}
              disabled={!canContinue && !readonly}
            >
              <IconNextBack className="next-icon" />
            </button>
            <span>{D.nextButton}</span>
          </div>
        )}
        {!readonly && rereading && !isLastComponent && (
          <div className="fast-button navigation">
            <button
              ref={fastNextButtonRef}
              className="navigation-button"
              type="button"
              onClick={pageFastForward}
            >
              {`${D.fastForward}`}
              <IconFastForward className="fast-icon" />
            </button>
            <span>
              <b>{D.ctrlEnd}</b>
            </span>
          </div>
        )}
      </StyleWrapper>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </>
  );
};

Buttons.propTypes = {
  readonly: PropTypes.bool.isRequired,
  rereading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  canContinue: PropTypes.bool.isRequired,
  isLastComponent: PropTypes.bool.isRequired,
  pageNext: PropTypes.func.isRequired,
  pagePrevious: PropTypes.func.isRequired,
  pageFastForward: PropTypes.func.isRequired,
  finalQuit: PropTypes.func.isRequired,
};

export default React.memo(Buttons);
