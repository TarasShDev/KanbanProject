using System;
using System.Linq;
using System.Web.Mvc;

using PlanningBoard.Infrastructure.Alerts;
using PlanningBoard.Model;
using PlanningBoard.ViewModels;

namespace PlanningBoard.Controllers
{
    public class BoardController : BaseController
    {
        private readonly IBoardRepository _boardRepository;
        private readonly IColumnRepository _columnRepository;
        private readonly IColorRepository _colorRepository;
        private readonly ITaskRepository _taskRepository;

        public BoardController()
        {
            _boardRepository = new BoardRepository();
            _columnRepository = new ColumnRepository();
            _colorRepository = new ColorRepository();
            _taskRepository = new TaskRepository();
        }

        public ActionResult Index(int id)
        {
            var colors = _colorRepository.List();
            var board = _boardRepository.Get(id);
            var columns = _columnRepository.List(board.Id);
            var tasks = _taskRepository.List(id);

            ViewBag.BoardName = _boardRepository.List().Single(b => b.Id==id).Name;
            ViewBag.HasColumns = columns.Count > 0;

            var model = new BoardViewModel()
            {
                Board = board,
                Columns = columns,
                Colors = colors,
                Tasks = tasks.ToList()
            };

            return View(model);
        }

        [HttpPost]
        public void MoveTask(int taskId, int columnId)
        {
            var task = _taskRepository.Get(taskId);
            if (task.ColumnId == columnId) return;

            task.ColumnId = columnId;
            _taskRepository.Update(task);
        }

        [HttpPost]
        public ActionResult EditTask(int boardId, Task task)
        {
            if (ToDelete)
            {
                _taskRepository.Delete(task);
                return RedirectToAction("Index", new{id = boardId}).WithSuccess("Task Was Deleted");
            }

            if (!string.IsNullOrEmpty(task.Owner)) 
                task.Owner = task.Owner.Trim();

            if (task.Id == 0)
            {
                task.ColumnId = _columnRepository.List(boardId).First().Id;
                _taskRepository.Add(task);
                return RedirectToAction("Index", new { id = boardId }).WithSuccess("Task Was Added");
            }

            _taskRepository.Update(task);
            return RedirectToAction("Index", new { id = boardId }).WithSuccess("Task Was Saved");
        }

        [HttpGet]
        public ActionResult GetTask(string id)
        {
            var taskId = Convert.ToInt32(id.Substring(5));
            var task = _taskRepository.Get(taskId);
            var jsonResult = Json( new {
                        id = task != null ? task.Id : 0,
                        title = task != null ? task.Title : "",
                        text = task != null ? task.Description : "",
                        owner = task != null ? task.Owner : "",
                        columnId = task != null ? task.ColumnId : 0,
                        prio = task != null ? task.Prio : 100,
                        colorId = task != null ? task.ColorId : 1 }
            , JsonRequestBehavior.AllowGet);
            return jsonResult;
        }

        [HttpGet]
        public ActionResult GetOwners()
        {
            var owners = _taskRepository.List().Select(t => t.Owner).Distinct().ToArray();
            return Json(owners, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddColumn(Column column)
        {
            _columnRepository.Add(column);
            return RedirectToAction("Index", new { id = column.BoardId}).WithSuccess("Column Was Added");
        }
    }
}