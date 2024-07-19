import React from "react";

const TimeAndLocation = ({weather: {formattedLocationTime, name, country},}) => {
  return <div>
    <div className="flex items-center justify-center my-6">
        <p className="text-xl font-extralight">
            {formattedLocationTime}
        </p>
    </div>
    <div>
        <p className="text-3xl font-medium">{`${name},${country}`}</p>
    </div>
 </div>;
};

export default TimeAndLocation;
