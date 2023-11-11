function PersonList() {
    return (
        <div className="persons-list flex justify-between items-center bg-slate-300 rounded-lg mb-1">
            <div className="person  p-4 rounded-lg">
                <div className="person-name text-lg font-bold">John Doe</div>
                <div className="message text-sm font-thin truncate overflow-ellipsis max-w-[300px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit labore eaque fuga consectetur quia
                    excepturi provident maxime dolorem laboriosam consequatur.
                </div>
            </div>
            <div className="badge bg-green-600 w-6 h-6 rounded-full text-white flex justify-center items-center mr-3">
                <span className="text-white text-xs">1</span>
            </div>
        </div>
    );
}

export default PersonList;
