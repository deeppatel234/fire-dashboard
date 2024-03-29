import React, { useContext, useEffect, useState } from "react";
import { add, compareAsc } from "date-fns/esm";
import { toast } from "react-toastify";

import Loading from "components/Loading";

import AppContext from "src/AppContext";

import { localGet, localSet } from "utils/chromeStorage";
import EventManager from "utils/EventManager";

const timeMapping = {
  "MIN-1": {
    minutes: 1,
  },
  "MIN-30": {
    minutes: 30,
  },
  "HR-1": {
    hours: 1,
  },
  "HR-3": {
    hours: 3,
  },
  "HR-6": {
    hours: 6,
  },
  "HR-9": {
    hours: 9,
  },
  "HR-12": {
    hours: 12,
  },
  "DAY-1": {
    days: 1,
  },
  "WEEK-1": {
    weeks: 1,
  },
  "MONTH-1": {
    months: 1,
  },
};

const BGImage = () => {
  const { workspace, updateWorkspace } = useContext(AppContext);
  const [bgImageUrl, setBgImageUrl] = useState();
  const [isBgLoading, setIsBgLoading] = useState(false);

  const setDefaultImg = () => {
    setBgImageUrl("/assets/bg.jpg");
  };

  const loadImageFromUrl = async (url) => {
    setIsBgLoading(true);
    try {
      await fetch(url);
      setBgImageUrl(url);
    } catch (err) {
      setDefaultImg();
    }
    setIsBgLoading(false);
  };

  const loadImage = async ({ newWorkspace, forceUpdate }) => {
    const { imageType, imageConfig } =
      (newWorkspace || workspace)?.settings?.home || {};

    const { lastUpdateDate, lastUpdateImage } =
      (await localGet(["lastUpdateDate", "lastUpdateImage"], workspace.id)) ||
      {};

    if (
      !forceUpdate &&
      lastUpdateDate &&
      (imageType === "CUSTOM" || imageType === "UNSPLASH")
    ) {
      if (
        compareAsc(
          add(lastUpdateDate, timeMapping[imageConfig.updateInterval]),
          new Date(),
        ) !== -1
      ) {
        setBgImageUrl(lastUpdateImage);
        return;
      }
    }

    if (imageType === "NO_IMAGE") {
      setBgImageUrl(null);
    } else if (imageType === "DEFAULT") {
      setDefaultImg();
    } else if (imageType === "CUSTOM") {
      const imageLength = imageConfig?.customImageUrls?.length;
      if (imageLength) {
        const currentIndex = await localGet("customImageIndex", workspace.id);
        const newIndex = currentIndex < imageLength ? currentIndex : 0;
        loadImageFromUrl(imageConfig.customImageUrls[newIndex]);
        localSet(
          {
            customImageIndex: newIndex + 1,
            lastUpdateDate: Date.now(),
            lastUpdateImage: imageConfig.customImageUrls[newIndex],
          },
          workspace.id,
        );
      } else {
        setBgImageUrl(null);
      }
    } else if (imageType == "UNSPLASH") {
      const fetchUrl = `https://source.unsplash.com/random/${
        window.outerWidth
      }x${window.innerHeight}?${imageConfig.unsplashCategories.join(",")}`;

      setIsBgLoading(true);

      try {
        const res = await fetch(fetchUrl);
        if (res.url) {
          loadImageFromUrl(res.url);
          localSet(
            { lastUpdateDate: Date.now(), lastUpdateImage: res.url },
            workspace.id,
          );
        } else {
          setDefaultImg();
        }
      } catch (err) {
        setDefaultImg();
      }

      setIsBgLoading(false);
    }
  };

  useEffect(() => {
    loadImage({});

    const refreshImage = (newWorkspace) => {
      loadImage({ newWorkspace, forceUpdate: true });
    };

    EventManager.on("refreshImage", refreshImage);

    return () => {
      EventManager.off("refreshImage", refreshImage);
    };
  }, [workspace]);

  useEffect(() => {
    const saveToCustomUrl = async () => {
      workspace.settings.home.imageConfig.customImageUrls.push(bgImageUrl);
      try {
        await updateWorkspace(workspace);
        toast.success("Url added successfully");
      } catch (err) {
        toast.error("Failed to set custom url");
      }
    };

    EventManager.on("saveToCustomUrl", saveToCustomUrl);

    return () => {
      EventManager.off("saveToCustomUrl", saveToCustomUrl);
    };
  }, [workspace, bgImageUrl]);

  useEffect(() => {
    document.getElementById("main-bg").style.backgroundImage = bgImageUrl
      ? `url(${bgImageUrl})`
      : null;

    if (bgImageUrl) {
      document.getElementById("main-layout-wrapper").classList.add("bg");
    }

    return () => {
      document.getElementById("main-layout-wrapper").classList.remove("bg");
      // document.getElementById("main-bg").style.backgroundImage = null;
    };
  }, [bgImageUrl]);

  return <>{isBgLoading ? <Loading className="image-loader-main" /> : null}</>;
};

export default BGImage;
