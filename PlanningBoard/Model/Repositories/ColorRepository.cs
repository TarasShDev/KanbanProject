using System.Collections.Generic;
using System.Linq;
using Dapper;
using Dapper.Contrib.Extensions;

namespace PlanningBoard.Model
{
    public class ColorRepository : BaseRepository, IColorRepository
    {
        public List<Color> List()
        {
            using (var cnn = GetConnection())
            {
                return cnn.Query<Color>("select * from colors").ToList();
            }
        }

        public int Add(Color color)
        {
            using (var cnn = GetConnection())
            {
                return (int) cnn.Insert(color);
            }
        }
    }
}