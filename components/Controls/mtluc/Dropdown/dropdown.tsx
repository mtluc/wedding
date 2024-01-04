import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Portal from "../Portal/portal";
import { HandleClickOutSide, getPositionElementInWindow } from "../base/common";

interface DropDownProps {
  parentRef: RefObject<HTMLElement>;
  autoShow: boolean;
  isShow: boolean;
  showChange?: (isShow: boolean) => void;
  children?: React.ReactNode;
}

export const DropDown = (props: DropDownProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(props.isShow);
  const [css, setCss] = useState({
    top: 0,
    left: 0,
    right: -1,
    bottom: -1,
    visibility: "collapse" as "collapse" | "visible",
  });
  useEffect(() => {
    setIsShow(props.isShow);
  }, [props.isShow]);

  const calcCss = useCallback(async () => {
    const _css = {
      top: 0,
      left: 0,
      right: -1,
      bottom: -1,
      visibility: "collapse" as "collapse" | "visible",
    };
    await setCss(_css);

    if (props.parentRef.current?.ELEMENT_NODE && popupRef.current) {
      const bonParent = getPositionElementInWindow(props.parentRef.current);
      const bonPopup = getPositionElementInWindow(popupRef.current);
      let top = bonParent.y + bonParent.height;
      let left = bonParent.x;

      if (left + bonPopup.width > window.innerWidth) {
        left = left - +bonPopup.width + bonParent.width;
      }
      _css.left = left;

      if (top + bonPopup.height > window.innerHeight) {
        _css.bottom = window.innerHeight - bonParent.y;
        _css.top = -1;
      } else {
        _css.top = top;
      }

      _css.visibility = "visible";

      setCss(_css);
    }
  }, [props.parentRef]);

  useEffect(() => {
    if (isShow) {
      setTimeout(async () => {
        calcCss();
      });
    }

    async function _handleWindowScroll(event: Event) {
      if (isShow) {
        await setIsShow(false);
        props.showChange?.(false);
      }
    }
    document.addEventListener("scroll", _handleWindowScroll);
    window.addEventListener("resize", _handleWindowScroll);
    return () => {
      document.removeEventListener("scroll", _handleWindowScroll);
      window.removeEventListener("resize", _handleWindowScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  HandleClickOutSide(popupRef, async (e: Event) => {
    if (
      props.parentRef.current &&
      !(props.parentRef.current as any).contains(e.target)
    ) {
      await setIsShow(false);
      props.showChange?.(false);
    }
  });

  useEffect(() => {
    async function _handleParentClick(event: Event) {
      if (props.autoShow) {
        const _isShow = !isShow;
        await setIsShow(_isShow);
        props.showChange?.(_isShow);
      }
    }
    props.parentRef.current?.addEventListener("click", _handleParentClick);
    return () => {
      props.parentRef.current?.removeEventListener("click", _handleParentClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow, props.parentRef, props.autoShow]);

  const windowWheel = useCallback(
    async (e: any) => {
      if (isShow) {
        await setIsShow(false);
        props.showChange?.(false);
      }
    },
    [isShow, props]
  );

  useEffect(() => {
    if (window) {
      window.addEventListener("wheel", windowWheel, false);
    }
    return () => {
      if (window) {
        window.removeEventListener("scroll", windowWheel, false);
      }
    };
  }, [isShow, windowWheel]);

  return (
    <>
      {isShow ? (
        <Portal>
          <div
            ref={popupRef}
            className="mtl-dropdown"
            style={{
              top: css.top >= 0 ? css.top : "auto",
              left: css.left >= 0 ? css.left : "auto",
              right: css.right >= 0 ? css.right : "auto",
              bottom: css.bottom >= 0 ? css.bottom : "auto",
              visibility: css.visibility,
            }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            {props.children}
          </div>
        </Portal>
      ) : null}
    </>
  );
};
DropDown.defaultProps = {
  isShow: false,
  autoShow: true,
};
