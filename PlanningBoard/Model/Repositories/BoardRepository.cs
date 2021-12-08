using System.Collections.Generic;
using System.Linq;
using Dapper;
using Dapper.Contrib.Extensions;

namespace PlanningBoard.Model
{
    public class BoardRepository : BaseRepository, IBoardRepository
    {
        public List<Board> List()
        {
            using (var cnn = GetConnection())
            {
                return cnn.Query<Board>("select * from boards").ToList();
            }
        }

        public List<Board> List(int userId)
        {
            using (var cnn = GetConnection())
            {
                return
                    cnn.Query<Board>(
                        "select * from boards b inner join boardusers bu on bu.boardid = b.Id and bu.userid = @userId",
                        new {userId}).ToList();
            }
        }

        public List<BoardUser> BoardUsers(int userId)
        {
            using (var cnn = GetConnection())
            {
                return cnn.Query<BoardUser>("select * from boardusers where userid = @userId",new { userId }).ToList();
            }
        }

        public int Add(Board board)
        {
            using (var cnn = GetConnection())
            {
                return (int) cnn.Insert(board);
            }
        }

        public int Add(BoardUser boardUser)
        {
            using (var cnn = GetConnection())
            {
                return (int)cnn.Insert(boardUser);
            }
        }

        public Board Get(int id)
        {
            using (var cnn = GetConnection())
            {
                return cnn.Get<Board>(id);
            }
        }

        public void Update(Board board)
        {
            using (var cnn = GetConnection())
            {
                SqlMapperExtensions.Update(cnn, board);
            }
        }
    }
}